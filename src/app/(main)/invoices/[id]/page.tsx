import InvoiceInfo, { RateBeforeInvoiceDialog } from "./InvoiceInfo";

interface PageParams {
  params: Promise<{ id: string }>;
}
export default async function Page({ params }: PageParams) {
  const { id } = await params;
  return (
    <main className="bg-background mx-auto max-w-4xl w-full p-4 ">
      <RateBeforeInvoiceDialog />
      <InvoiceInfo id={id} />
    </main>
  );
}
