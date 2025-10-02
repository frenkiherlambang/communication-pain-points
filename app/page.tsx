import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-600">
            SIRENE Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            SIRENE
            <span className="block text-blue-600">Communication Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Identify and resolve customer communication frustrations across all your products. 
            From pre-purchase inquiries to after-sales support, we strengthen trust and improve brand perception.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/login">Access Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            SIRENE Research Focus Areas
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive analysis of communication potential and pain points
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pain Point Detection */}
          <Card className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Pain Point Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm space-y-2">
                <div>• Customer service frustrations</div>
                <div>• Product information confusion</div>
                <div>• Lack of personalization</div>
                <div>• Expectation vs. response gaps</div>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Crisis Triggers */}
          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Crisis Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm space-y-2">
                <div>• Negative sentiment spikes</div>
                <div>• Service failure communications</div>
                <div>• Viral complaint monitoring</div>
                <div>• Systemic issue identification</div>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Opportunity Identification */}
          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm space-y-2">
                <div>• FAQ improvement insights</div>
                <div>• Campaign messaging clarity</div>
                <div>• Channel optimization</div>
                <div>• Response speed enhancement</div>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Actionable Outputs */}
          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Actionable Outputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm space-y-2">
                <div>• Content plan inputs</div>
                <div>• Campaign brief insights</div>
                <div>• Communication recommendations</div>
                <div>• Platform usage optimization</div>
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Customer Communications?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join SIRENE and start identifying communication pain points with advanced intelligence today.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/customer-feedbacks">Analyze Feedbacks</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 SIRENE - Communication Intelligence Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
