import type { ProductSpec } from "@/lib/products";

type ProductSpecsTableProps = {
  specs: ProductSpec[];
  /** Identificador estável para `aria-labelledby` (ex.: `productSlug`). */
  productSlug: string;
};

export function ProductSpecsTable({ specs, productSlug }: ProductSpecsTableProps) {
  const headingId = `product-specs-${productSlug}-heading`;

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-zinc-50"
      aria-labelledby={headingId}
    >
      <div className="border-b border-zinc-200 px-4 py-4 sm:px-5 sm:py-4">
        <h2
          id={headingId}
          className="text-xs font-medium uppercase tracking-[0.2em] text-[#b49ecc]/90"
        >
          Este produto inclui
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {specs.map((spec, index) => (
              <tr
                key={`${spec.label}-${index}`}
                className="odd:bg-zinc-100/90 even:bg-zinc-50/80"
              >
                <th
                  scope="row"
                  className="max-w-[45%] px-4 py-3 text-left font-medium text-foreground sm:px-5"
                >
                  {spec.label}
                </th>
                <td className="min-w-0 px-4 py-3 text-right break-words text-foreground sm:px-5">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
