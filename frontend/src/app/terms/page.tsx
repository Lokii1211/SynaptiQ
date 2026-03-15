'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xs">ST</div>
                        <span className="text-lg font-bold">Mentixy</span>
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
                        <p className="text-white/60 text-sm">Last updated: February 26, 2026 | Effective from February 26, 2026</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">

                    <h2>1. Acceptance of Terms</h2>
                    <p>By creating an account or using Mentixy (&quot;VIYA&quot;, &quot;the Platform&quot;), you agree to these Terms of Service. If you do not agree, do not use the Platform. If you are under 18, you must have parental consent to use Mentixy.</p>

                    <h2>2. Description of Service</h2>
                    <p>Mentixy is an AI-powered career intelligence platform providing:</p>
                    <ul>
                        <li>Psychometric career assessment (4D model)</li>
                        <li>AI-powered career counseling</li>
                        <li>Coding practice and compilation (multi-language)</li>
                        <li>Aptitude test preparation</li>
                        <li>Skill verification and certification</li>
                        <li>Mentixy Score™ career readiness metric</li>
                        <li>Campus Wars (gamified college competition)</li>
                        <li>Mock placement drive simulation</li>
                        <li>Career roadmap generation</li>
                        <li>Parent Intelligence Portal</li>
                    </ul>

                    <h2>3. User Accounts</h2>
                    <ul>
                        <li>You must provide accurate information during registration.</li>
                        <li>You are responsible for maintaining the security of your account.</li>
                        <li>One person may only create one account.</li>
                        <li>Sharing accounts or creating multiple accounts is prohibited.</li>
                        <li>You must be at least 16 years old to create an account.</li>
                    </ul>

                    <h2>4. Acceptable Use</h2>
                    <p>You agree NOT to:</p>
                    <ul>
                        <li>Submit malicious code to our compiler (viruses, fork bombs, infinite loops designed to crash systems)</li>
                        <li>Attempt to access other users&apos; accounts or data</li>
                        <li>Share assessment answers or cheat on skill verification quizzes</li>
                        <li>Create fake accounts to manipulate Campus Wars leaderboards</li>
                        <li>Use the AI Counselor for purposes other than career guidance</li>
                        <li>Attempt to extract, scrape, or reverse-engineer our APIs or algorithms</li>
                        <li>Post offensive, discriminatory, or harmful content in the community</li>
                        <li>Misrepresent your identity, college, or qualifications</li>
                    </ul>

                    <h2>5. Assessment & Scores</h2>
                    <ul>
                        <li>The 4D Psychometric Assessment provides career guidance based on your responses. It is <strong>not</strong> a clinical psychological evaluation.</li>
                        <li>Mentixy Score™ is a relative metric of career readiness, not an absolute measure of ability.</li>
                        <li>Assessment results and skill scores are <strong>recommendations</strong>, not guarantees of employment.</li>
                        <li>Verified skill badges expire after 90 days and must be renewed through re-assessment.</li>
                    </ul>

                    <h2>6. AI Career Counselor</h2>
                    <ul>
                        <li>The AI Counselor provides guidance based on available data and AI models.</li>
                        <li>Salary predictions are <strong>estimates</strong> based on market data, not guaranteed offers.</li>
                        <li>AI responses may occasionally contain inaccuracies. Verify important information independently.</li>
                        <li>The AI Counselor is <strong>not</strong> a substitute for professional mental health support.</li>
                        <li>If you are experiencing mental health difficulties, please contact <strong>iCall: 9152987821</strong> or <strong>Vandrevala Foundation: 1860-2662-345</strong>.</li>
                    </ul>

                    <h2>7. Coding Compiler</h2>
                    <ul>
                        <li>Code submitted to our compiler is executed in a sandboxed environment.</li>
                        <li>We reserve the right to limit execution time, memory, and output size.</li>
                        <li>Code submissions may be stored for quality improvement and plagiarism detection.</li>
                        <li>You retain intellectual property rights to your original code.</li>
                    </ul>

                    <h2>8. Campus Wars & Leaderboards</h2>
                    <ul>
                        <li>Leaderboard rankings are calculated from verified user activity.</li>
                        <li>We reserve the right to remove users or colleges engaged in manipulation.</li>
                        <li>Rankings do not imply an official ranking by any educational body.</li>
                    </ul>

                    <h2>9. Parent Portal</h2>
                    <ul>
                        <li>Parent Portal access requires student consent.</li>
                        <li>Parents receive aggregate summaries, not detailed chat logs or raw assessment data.</li>
                        <li>Students can revoke parent access at any time through Settings.</li>
                    </ul>

                    <h2>10. Free & Premium Plans</h2>
                    <ul>
                        <li><strong>Free tier:</strong> Assessment, limited daily coding challenges, basic AI counseling, Mentixy Score™.</li>
                        <li><strong>Pro tier (₹299/month):</strong> Unlimited AI sessions, full compiler access, detailed analytics, priority support.</li>
                        <li>Payments processed securely through Razorpay.</li>
                        <li>Refund policy: 7-day money-back guarantee, no questions asked.</li>
                    </ul>

                    <h2>11. Intellectual Property</h2>
                    <ul>
                        <li>Mentixy, VIYA, CareerDNA™, Mentixy Score™, and Honest Mirror are trademarks of Mentixy.</li>
                        <li>Assessment questions, algorithms, and AI system prompts are proprietary.</li>
                        <li>User-generated content (community posts, code) remains your property but is licensed to us for platform display.</li>
                    </ul>

                    <h2>12. Limitation of Liability</h2>
                    <p>Mentixy provides career guidance tools. We are <strong>not</strong> an employment agency, educational institution, or placement guarantee service. We do not guarantee:</p>
                    <ul>
                        <li>Placement or employment outcomes</li>
                        <li>Accuracy of AI-generated salary predictions</li>
                        <li>That following our career recommendations will lead to specific outcomes</li>
                    </ul>

                    <h2>13. Account Termination</h2>
                    <ul>
                        <li>You may delete your account at any time through Settings.</li>
                        <li>We may suspend accounts that violate these terms.</li>
                        <li>Upon deletion, personal data is purged within 30 days per our Privacy Policy.</li>
                    </ul>

                    <h2>14. Governing Law</h2>
                    <p>These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.</p>

                    <h2>15. Contact</h2>
                    <p>Questions about these Terms? Contact us at <strong>legal@mentixy.in</strong></p>

                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link href="/" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">← Back to Mentixy</Link>
                    <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-700">Privacy Policy →</Link>
                </div>
            </div>
        </div>
    );
}
