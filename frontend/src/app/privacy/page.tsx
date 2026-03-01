'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xs">ST</div>
                        <span className="text-lg font-bold">SkillTen</span>
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                        <p className="text-white/60 text-sm">Last updated: February 26, 2026 | Effective from February 26, 2026</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 not-prose">
                        <p className="text-sm text-blue-800 font-medium">🇮🇳 PDPB 2023 Compliant</p>
                        <p className="text-xs text-blue-600 mt-1">This privacy policy complies with the Digital Personal Data Protection Bill, 2023 (India) and applicable data protection regulations.</p>
                    </div>

                    <h2>1. Who We Are</h2>
                    <p>SkillTen (&quot;VIYA&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an AI-powered Career Intelligence Platform designed for Indian engineering students. We provide career assessment, skill verification, AI career counseling, coding practice, and placement preparation tools.</p>

                    <h2>2. What Data We Collect</h2>
                    <h3>2.1 Information You Provide</h3>
                    <ul>
                        <li><strong>Account Information:</strong> Name, email address, username, college name, year of study, branch/stream.</li>
                        <li><strong>Assessment Data:</strong> Your responses to psychometric assessment questions and career preference inputs.</li>
                        <li><strong>Skill Data:</strong> Coding submissions, aptitude test responses, skill verification quiz answers.</li>
                        <li><strong>Profile Data:</strong> Target role, city, bio, LinkedIn URL, GitHub username (all optional).</li>
                        <li><strong>Communication Data:</strong> Messages sent to our AI Career Counselor.</li>
                    </ul>

                    <h3>2.2 Information We Collect Automatically</h3>
                    <ul>
                        <li><strong>Usage Data:</strong> Features accessed, session duration, streak data, activity heatmap.</li>
                        <li><strong>Device Data:</strong> Device type, browser type, operating system, screen resolution.</li>
                        <li><strong>Performance Data:</strong> SkillTen Score™ calculations, percentile rankings, coding performance metrics.</li>
                    </ul>

                    <h3>2.3 Information We Never Collect</h3>
                    <ul>
                        <li>Aadhaar or government ID numbers</li>
                        <li>Financial information (bank accounts, UPI IDs) unless for payments</li>
                        <li>Location data (GPS tracking)</li>
                        <li>Contacts or phone call logs</li>
                        <li>Biometric data</li>
                    </ul>

                    <h2>3. How We Use Your Data</h2>
                    <ul>
                        <li><strong>Career Assessment:</strong> To generate your CareerDNA™ profile and career recommendations.</li>
                        <li><strong>AI Counseling:</strong> To provide personalized, India-specific career guidance.</li>
                        <li><strong>Skill Verification:</strong> To calculate and display your verified skill scores.</li>
                        <li><strong>SkillTen Score™:</strong> To compute your composite career readiness score.</li>
                        <li><strong>Campus Wars:</strong> To display aggregate college-level leaderboards (never individual details).</li>
                        <li><strong>Parent Portal:</strong> Weekly summary shared only with your explicit consent.</li>
                        <li><strong>Job Matching:</strong> To match you with relevant internship and job opportunities.</li>
                        <li><strong>Product Improvement:</strong> Aggregate, anonymized usage analytics to improve our platform.</li>
                    </ul>

                    <h2>4. Data Sharing</h2>
                    <p>We do <strong>NOT</strong> sell your personal data. We share data only in these cases:</p>
                    <ul>
                        <li><strong>Public Profile:</strong> Information you choose to make public on your SkillTen profile.</li>
                        <li><strong>Recruiter Portal:</strong> Only your public profile data, verified skills, and SkillTen Score™ — never assessment raw data or chat history.</li>
                        <li><strong>Campus Command Center:</strong> Only aggregate (college-level) statistics to T&P officers — never individual assessment details.</li>
                        <li><strong>Legal Requirements:</strong> If required by Indian law or court order.</li>
                    </ul>

                    <h2>5. Data Security</h2>
                    <ul>
                        <li>All data encrypted in transit (HTTPS/TLS 1.3)</li>
                        <li>Database encryption at rest</li>
                        <li>JWT-based authentication with token rotation</li>
                        <li>Regular security audits</li>
                        <li>No sensitive data stored in client-side storage</li>
                    </ul>

                    <h2>6. Your Rights (Under PDPB 2023)</h2>
                    <ul>
                        <li><strong>Right to Access:</strong> View all data we hold about you.</li>
                        <li><strong>Right to Correction:</strong> Update or correct any inaccurate information.</li>
                        <li><strong>Right to Erasure:</strong> Request permanent deletion of all your data.</li>
                        <li><strong>Right to Data Portability:</strong> Export your data in a standard format.</li>
                        <li><strong>Right to Withdraw Consent:</strong> Revoke consent for data processing at any time.</li>
                    </ul>
                    <p>To exercise any of these rights, email us at <strong>privacy@skillten.in</strong></p>

                    <h2>7. Data Retention</h2>
                    <ul>
                        <li>Account data: Retained while your account is active.</li>
                        <li>Assessment results: Retained for 2 years after last login.</li>
                        <li>AI chat history: Retained for 6 months, then auto-deleted.</li>
                        <li>Coding submissions: Retained for 1 year.</li>
                        <li>After account deletion: All personal data purged within 30 days.</li>
                    </ul>

                    <h2>8. Children&apos;s Privacy</h2>
                    <p>SkillTen is intended for users aged 16 and above. Users under 18 may use the platform with parental consent, which can be registered through our Parent Portal.</p>

                    <h2>9. AI-Specific Disclosures</h2>
                    <ul>
                        <li>Our AI Career Counselor uses Claude (Anthropic) and Gemini (Google) APIs.</li>
                        <li>Your chat messages are processed by these AI services but are not used to train their models.</li>
                        <li>AI-generated salary data and career recommendations are estimates, not guarantees.</li>
                        <li>We implement output validation to catch and filter inaccurate AI responses.</li>
                    </ul>

                    <h2>10. Changes to This Policy</h2>
                    <p>We may update this policy. Material changes will be communicated via email and in-app notification at least 15 days before taking effect.</p>

                    <h2>11. Contact Us</h2>
                    <p>For privacy-related queries:</p>
                    <ul>
                        <li>Email: <strong>privacy@skillten.in</strong></li>
                        <li>Grievance Officer: As required under Indian law, contact <strong>grievance@skillten.in</strong></li>
                    </ul>

                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link href="/" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">← Back to SkillTen</Link>
                    <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-700">Terms of Service →</Link>
                </div>
            </div>
        </div>
    );
}
