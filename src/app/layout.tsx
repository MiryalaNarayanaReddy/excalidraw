import { DrawingProvider } from "@/context/DrawingContext";
import Navbar from "@/components/Navbar"; // Fixed case issue

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="w-full">

        <DrawingProvider>
        <Navbar />
          {/* Main content */}
          {children}
        </DrawingProvider>
      </body>
    </html>
  );
}
