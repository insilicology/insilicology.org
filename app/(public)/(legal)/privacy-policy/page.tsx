import React from 'react';

export const metadata = {
  title: "Privacy Policy - Insilicology",
  description: "This page outlines the privacy practices of Insilicology, detailing how we collect, use, and protect your personal information when you use our educational platform.",
  keywords: ["insilicology", "privacy policy", "insilicology privacy policy", "data protection", "educational privacy"],
  metadataBase: new URL("https://insilicology.org"),
  alternates: {
    canonical: `/privacy-policy`,
  },
};

export default function PrivacyPolicy() {
  return (    
    <section className="space-y-6">
      <div className="max-w-4xl mx-auto py-16 px-3 sm:px-8 space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>

        <p className="text-lg text-gray-700">
          Insilicology ("we", "us", or "our") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website https://insilicology.org and use our educational services. Please read this policy carefully to understand our practices.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">1. Information We Collect</h2>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6">1.1 Personal Information</h3>
        <p className="text-gray-700">
          We may collect the following personal information when you use our services:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Name, email address, and phone number</li>
          <li>Educational background and professional information</li>
          <li>Payment information (processed securely through third-party payment processors)</li>
          <li>Course enrollment and progress data</li>
          <li>Communication preferences and marketing consent</li>
        </ul>

        <h3 className="text-xl font-medium text-gray-800 mt-6">1.2 Automatically Collected Information</h3>
        <p className="text-gray-700">
          When you visit our website, we automatically collect:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>IP address and device information</li>
          <li>Browser type and version</li>
          <li>Pages visited and time spent on our site</li>
          <li>Referring website information</li>
          <li>Usage patterns and preferences</li>
        </ul>

        <h3 className="text-xl font-medium text-gray-800 mt-6">1.3 Cookies and Tracking Technologies</h3>
        <p className="text-gray-700">
          We use cookies and similar tracking technologies to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Remember your preferences and login information</li>
          <li>Analyze website traffic and usage patterns</li>
          <li>Improve our services and user experience</li>
          <li>Provide personalized content and recommendations</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">2. How We Use Your Information</h2>
        <p className="text-gray-700">
          We use your information for the following purposes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Provide and maintain our educational services</li>
          <li>Process course enrollments and payments</li>
          <li>Track your learning progress and provide personalized recommendations</li>
          <li>Send important updates about your courses and account</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Improve our website and services</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Ensure security and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">3. Information Sharing and Disclosure</h2>
        <p className="text-gray-700">
          We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our platform, processing payments, and delivering services</li>
          <li><strong>Legal Requirements:</strong> To comply with applicable laws, regulations, or legal processes</li>
          <li><strong>Protection of Rights:</strong> To protect our rights, property, or safety, or that of our users</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">4. Data Security</h2>
        <p className="text-gray-700">
          We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Encryption of sensitive data in transit and at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication measures</li>
          <li>Secure data storage and backup procedures</li>
          <li>Employee training on data protection practices</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">5. Data Retention</h2>
        <p className="text-gray-700">
          We retain your personal information for as long as necessary to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Provide our services to you</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce agreements</li>
          <li>Maintain accurate business records</li>
        </ul>
        <p className="text-gray-700 mt-4">
          When we no longer need your information, we will securely delete or anonymize it.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">6. Your Rights and Choices</h2>
        <p className="text-gray-700">
          You have the following rights regarding your personal information:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li><strong>Access:</strong> Request access to your personal information</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
          <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
          <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
          <li><strong>Objection:</strong> Object to processing for direct marketing purposes</li>
          <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">7. Children's Privacy</h2>
        <p className="text-gray-700">
          Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">8. International Data Transfers</h2>
        <p className="text-gray-700">
          Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">9. Third-Party Links and Services</h2>
        <p className="text-gray-700">
          Our website may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">10. Changes to This Privacy Policy</h2>
        <p className="text-gray-700">
          We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">11. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <p className="text-gray-700">
            <strong>Email:</strong> <a href="mailto:insilicology@gmail.com" className="text-blue-600 hover:text-blue-800">insilicology@gmail.com</a><br/>
            <strong>Website:</strong> <a href="https://insilicology.org" className="text-blue-600 hover:text-blue-800">https://insilicology.org</a>
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-sm text-gray-600">
            <strong>Last Updated:</strong> December 2024
          </p>
        </div>
      </div>
    </section>
  );
} 