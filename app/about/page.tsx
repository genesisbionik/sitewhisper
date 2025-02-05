export default function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">About SiteWhisper</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>
          SiteWhisper is an innovative AI-powered platform that transforms web content into structured, 
          actionable intelligence. Our mission is to make web analysis accessible and insightful for everyone.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p>
          We believe in making web content analysis simple, efficient, and accessible. 
          Our AI-powered platform helps users understand and extract valuable insights from any website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What We Do</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Transform web content into structured data</li>
          <li>Provide deep insights through AI analysis</li>
          <li>Create actionable intelligence from web content</li>
          <li>Make web analysis accessible to everyone</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          Have questions or want to learn more? We'd love to hear from you. 
          Reach out to us at <a href="mailto:contact@sitewhisper.ai" className="text-primary hover:underline">
          contact@sitewhisper.ai</a>
        </p>
      </div>
    </div>
  )
} 