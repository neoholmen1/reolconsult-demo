import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, message, products } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Navn og e-post er påkrevd." }, { status: 400 });
    }

    const productList = products
      ?.map((p: { name: string; qty: number }) => `  - ${p.name} (antall: ${p.qty})`)
      .join("\n") || "Ingen produkter valgt";

    const emailBody = `
Ny forespørsel fra nettside

Navn: ${name}
E-post: ${email}
Telefon: ${phone || "Ikke oppgitt"}
Bedrift: ${company || "Ikke oppgitt"}

Produkter:
${productList}

Melding:
${message || "Ingen melding"}
    `.trim();

    // For now, log the inquiry. In production, connect to an email service
    // like Resend, SendGrid, or nodemailer with SMTP.
    console.log("=== NY FORESPØRSEL ===");
    console.log(emailBody);
    console.log("======================");

    // Return mailto link as fallback so the client can open email client
    const subject = encodeURIComponent(`Forespørsel fra ${name} – ${company || "Privatperson"}`);
    const mailtoBody = encodeURIComponent(emailBody);
    const mailto = `mailto:mail@reolconsult.no?subject=${subject}&body=${mailtoBody}`;

    return NextResponse.json({ success: true, mailto });
  } catch {
    return NextResponse.json({ error: "Noe gikk galt." }, { status: 500 });
  }
}
