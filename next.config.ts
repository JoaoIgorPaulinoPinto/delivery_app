/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/estabelecimento",
        permanent: true, // Use 'true' para SEO (301) ou 'false' para redirecionamento temporário (307)
      },
    ];
  },
  // Tente listar o IP que apareceu no erro
  experimental: {
    allowedDevOrigins: ["192.168.1.18", "localhost:3000"],
  },
  // Se a versão do seu Next for mais recente, pode ser assim:
  devIndicators: {
    buildActivity: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
    ],
  },
};

module.exports = nextConfig;
