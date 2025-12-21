/** @type {import('next').NextConfig} */
const nextConfig = {
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
