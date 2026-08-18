-- Prisvisning av/på for chatboten.
--
-- Default false: chatboten nevner aldri konkrete priser før kunden aktivt
-- skrur det på. Det er den trygge tilstanden — en bot som oppgir priser
-- kunden ikke har godkjent, er verre enn en som henviser til telefon.
alter table site_settings
  add column if not exists show_prices boolean not null default false;

comment on column site_settings.show_prices is
  'Når true kan chatboten oppgi priser fra products.price_from. Priser lagres alltid eks. mva.';
