import "./globals.css";

export const metadata = {
  title: "Summarise — AI text summariser",
  description: "Paste long text, get a clear summary streamed back instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}