import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG ?? "reolconsult";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function parseTxt(buffer: Buffer): Promise<string> {
  return buffer.toString("utf-8");
}

async function parsePdf(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  return data.text;
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function parseSpreadsheet(buffer: Buffer, filename: string): Promise<string> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const lines: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (workbook.SheetNames.length > 1) {
      lines.push(`--- ${sheetName} ---`);
    }
    const csv = XLSX.utils.sheet_to_csv(sheet);
    lines.push(csv);
  }

  return lines.join("\n");
}

export async function POST(request: NextRequest) {
  // Check auth via Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  // Verify the token with Supabase. Vi bygger en klient som er autentisert som
  // brukeren slik at RLS-policy-ene gjelder for innsetting nedenfor.
  const token = authHeader.replace("Bearer ", "");
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Ugyldig token" }, { status: 401 });
  }

  // Slå opp current site (én site per deploy i fase 1).
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("id")
    .eq("slug", SITE_SLUG)
    .eq("active", true)
    .maybeSingle();

  if (siteError || !site) {
    return NextResponse.json({ error: "Fant ikke aktiv site" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const category = (formData.get("category") as string) || "Generelt";

  if (!file) {
    return NextResponse.json({ error: "Ingen fil valgt" }, { status: 400 });
  }

  const filename = file.name;
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const allowed = ["pdf", "docx", "txt", "xlsx", "csv"];

  if (!allowed.includes(ext)) {
    return NextResponse.json(
      { error: `Filtype .${ext} er ikke støttet. Bruk: ${allowed.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let content = "";
    switch (ext) {
      case "txt":
      case "csv":
        content = await parseTxt(buffer);
        break;
      case "pdf":
        content = await parsePdf(buffer);
        break;
      case "docx":
        content = await parseDocx(buffer);
        break;
      case "xlsx":
        content = await parseSpreadsheet(buffer, filename);
        break;
    }

    if (!content.trim()) {
      return NextResponse.json({ error: "Kunne ikke lese innhold fra filen" }, { status: 400 });
    }

    // Bruk userClient slik at RLS-sjekken (has_site_access) gjelder.
    const { data, error } = await userClient
      .from("chatbot_documents")
      .insert({
        site_id: site.id,
        filename,
        content: content.trim(),
        file_type: ext,
        category,
        uploaded_by: user.email,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Kunne ikke lagre dokument. Mangler du tilgang?" },
        { status: 403 },
      );
    }

    return NextResponse.json({ success: true, document: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Ukjent feil";
    return NextResponse.json({ error: `Parsing feilet: ${message}` }, { status: 500 });
  }
}
