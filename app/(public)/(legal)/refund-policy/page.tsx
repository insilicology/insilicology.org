import React from 'react';

export const metadata = {
  title: "Refund Policy - Insilicology",
  description: "This page outlines the refund policy of Insilicology, detailing how we handle refunds for our educational courses and services.",
  keywords: ["insilicology", "refund policy", "insilicology refund", "course refund", "educational refund"],
  metadataBase: new URL("https://insilicology.org"),
  alternates: {
    canonical: `/refund-policy`,
  },
};

export default function RefundPolicy() {
  return (    
    <section className="space-y-6">
      <div className="max-w-4xl mx-auto py-16 px-3 sm:px-8 space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Refund Policy</h1>

        <p className="text-lg text-gray-700">
          At Insilicology, we are committed to providing high-quality educational experiences. We understand that sometimes circumstances may require you to request a refund. This policy outlines our refund procedures and conditions for our educational courses and services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">1. General Refund Policy</h2>
        <p className="text-gray-700">
          We strive to ensure your satisfaction with our educational services. However, due to the digital nature of our courses and the immediate access provided upon purchase, we have specific refund policies in place to protect both our students and our platform.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">2. Refund Eligibility</h2>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6">2.1 Eligible for Refund</h3>
        <p className="text-gray-700">
          You may be eligible for a refund in the following circumstances:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Technical issues preventing access to course content that we cannot resolve within 48 hours</li>
          <li>Course content significantly differs from what was advertised</li>
          <li>Duplicate charges or billing errors</li>
          <li>Course cancellation by Insilicology</li>
          <li>Request made within the specified refund window (see section 3)</li>
        </ul>

        <h3 className="text-xl font-medium text-gray-800 mt-6">2.2 Not Eligible for Refund</h3>
        <p className="text-gray-700">
          Refunds will not be provided in the following cases:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Change of mind after accessing course content</li>
          <li>Failure to complete the course or achieve desired outcomes</li>
          <li>Personal circumstances preventing course completion</li>
          <li>Request made after the refund period has expired</li>
          <li>Violation of our Terms of Service</li>
          <li>Free courses or promotional content</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">3. Refund Timeframes</h2>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6">3.1 Standard Courses</h3>
        <p className="text-gray-700">
          For standard recorded courses, refund requests must be submitted within <strong>7 days</strong> of purchase and before completing more than 25% of the course content.
        </p>

        <h3 className="text-xl font-medium text-gray-800 mt-6">3.2 Live Courses</h3>
        <p className="text-gray-700">
          For live courses, refund requests must be submitted at least <strong>24 hours</strong> before the course start date. No refunds will be provided once the live course has begun.
        </p>

        <h3 className="text-xl font-medium text-gray-800 mt-6">3.3 Certification Programs</h3>
        <p className="text-gray-700">
          For certification programs, refund requests must be submitted within <strong>14 days</strong> of purchase and before accessing any certification materials or taking any assessments.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">4. How to Request a Refund</h2>
        <p className="text-gray-700">
          To request a refund, please follow these steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Contact our support team at <a href="mailto:insilicology@gmail.com" className="text-blue-600 hover:text-blue-800">insilicology@gmail.com</a></li>
          <li>Include your order number and the reason for the refund request</li>
          <li>Provide any relevant details about the issue you encountered</li>
          <li>Allow 3-5 business days for review and processing</li>
        </ol>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">5. Refund Processing</h2>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6">5.1 Review Process</h3>
        <p className="text-gray-700">
          All refund requests are reviewed by our support team. We may request additional information to better understand your situation and ensure fair processing.
        </p>

        <h3 className="text-xl font-medium text-gray-800 mt-6">5.2 Processing Time</h3>
        <p className="text-gray-700">
          Once approved, refunds are typically processed within 5-10 business days. The time for the refund to appear in your account depends on your payment method and financial institution.
        </p>

        <h3 className="text-xl font-medium text-gray-800 mt-6">5.3 Refund Methods</h3>
        <p className="text-gray-700">
          Refunds will be issued to the original payment method used for the purchase. If the original payment method is no longer available, we will work with you to arrange an alternative refund method.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">6. Partial Refunds</h2>
        <p className="text-gray-700">
          In certain circumstances, we may offer partial refunds:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>If you have completed more than 25% but less than 50% of a course</li>
          <li>For bundle purchases where only some courses are affected by issues</li>
          <li>When technical issues affect only specific portions of a course</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">7. Course Access After Refund</h2>
        <p className="text-gray-700">
          Upon approval of a refund:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Your access to the course content will be immediately revoked</li>
          <li>Any certificates or credentials earned will be invalidated</li>
          <li>You agree to cease using any downloaded or saved course materials</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">8. Special Circumstances</h2>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6">8.1 Medical Emergencies</h3>
        <p className="text-gray-700">
          In cases of serious medical emergencies that prevent course completion, we may consider refund requests outside the standard timeframe. Medical documentation may be required.
        </p>

        <h3 className="text-xl font-medium text-gray-800 mt-6">8.2 Technical Issues</h3>
        <p className="text-gray-700">
          If you experience persistent technical issues that prevent you from accessing course content, we will first attempt to resolve the issue. If resolution is not possible within 48 hours, a refund may be provided.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">9. Dispute Resolution</h2>
        <p className="text-gray-700">
          If you disagree with our refund decision, you may:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Request a review by our management team</li>
          <li>Provide additional documentation or evidence</li>
          <li>Contact us for further discussion of your specific circumstances</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">10. Contact Information</h2>
        <p className="text-gray-700">
          For refund requests or questions about this policy, please contact us:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <p className="text-gray-700">
            <strong>Email:</strong> <a href="mailto:insilicology@gmail.com" className="text-blue-600 hover:text-blue-800">insilicology@gmail.com</a><br/>
            <strong>Website:</strong> <a href="https://insilicology.org" className="text-blue-600 hover:text-blue-800">https://insilicology.org</a><br/>
            <strong>Response Time:</strong> Within 24-48 hours during business days
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">11. Policy Updates</h2>
        <p className="text-gray-700">
          We reserve the right to update this refund policy at any time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued use of our services after policy changes constitutes acceptance of the new terms.
        </p>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-sm text-gray-600">
            <strong>Last Updated:</strong> December 2024
          </p>
        </div>
      </div>
    </section>
  );
} 