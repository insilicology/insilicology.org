// app/(auth)/layout.tsx

export const metadata = {
  title: "Auth",
  description:
    "Login or register to Skilltori.",
  keywords: [
    "auth",
    "skilltori",
    "skilltori auth",
    "skilltori auth page",
    "skilltori auth page",
  ],
  metadataBase: new URL("https://skilltori.com"),
  alternates: {
    canonical: `/`,
  },
};
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-[family-name:var(--font-hind-siliguri)] text-black bg-white h-screen">
      {children}
    </div>
  );
}
