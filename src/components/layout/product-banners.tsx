type ProductBannersProps = {
  paths: string[];
  productName: string;
};

/** Banners em largura total, proporção natural da imagem, acima da tabela de especificações. */
export function ProductBanners({ paths, productName }: ProductBannersProps) {
  if (paths.length === 0) return null;

  return (
    <section className="space-y-4" aria-label={`Banners — ${productName}`}>
      {paths.map((src, i) => (
        // Dimensões intrínsecas do ficheiro; sem caixa de proporção nem fundo.
        // eslint-disable-next-line @next/next/no-img-element -- banners com razão variável, sem encaixe fixo
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`${productName} — destaque ${i + 1} de ${paths.length}`}
          className="block h-auto w-full max-w-full"
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={i === 0 ? "high" : "auto"}
        />
      ))}
    </section>
  );
}
