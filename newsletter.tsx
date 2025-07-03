import { Header } from "@/components/navigation/header";
import { NewsletterManager } from "@/components/newsletter/newsletter-manager";

export default function Newsletter() {
  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Newsletter Management</h1>
          <p className="text-gray-400">Create and manage your dance newsletters</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <NewsletterManager />
        </div>
      </div>
    </div>
  );
}
