/**
 * Mentixy — Internationalization (i18n) System
 * Bible §18: Support Hindi, Tamil, Telugu + Hinglish for Tier 2/3 students
 * 4 languages: English, Hindi, Tamil, Telugu
 */

export type Locale = 'en' | 'hi' | 'ta' | 'te';

interface TranslationEntry {
    en: string;
    hi: string;
    ta: string;
    te: string;
}

interface Translations {
    [key: string]: TranslationEntry;
}

export const t: Translations = {
    // ─── Navigation ───
    'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड', ta: 'டாஷ்போர்ட்', te: 'డ్యాష్‌బోర్డ్' },
    'nav.assessment': { en: 'Assessment', hi: 'मूल्यांकन', ta: 'மதிப்பீடு', te: 'అంచనా' },
    'nav.score': { en: 'Score', hi: 'स्कोर', ta: 'மதிப்பெண்', te: 'స్కోరు' },
    'nav.careers': { en: 'Careers', hi: 'करियर', ta: 'தொழில்கள்', te: 'కెరీర్లు' },
    'nav.practice': { en: 'Coding Arena', hi: 'कोडिंग अखाड़ा', ta: 'கோடிங் அரங்கம்', te: 'కోడింగ్ అరేనా' },
    'nav.aptitude': { en: 'Aptitude Engine', hi: 'एप्टीट्यूड इंजन', ta: 'திறன் இயந்திரம்', te: 'ఆప్టిట్యూడ్ ఇంజన్' },
    'nav.learn': { en: 'Learning Hub', hi: 'लर्निंग हब', ta: 'கற்றல் மையம்', te: 'లెర్నింగ్ హబ్' },
    'nav.roadmap': { en: 'My Roadmap', hi: 'मेरा रोडमैप', ta: 'என் திட்டம்', te: 'నా రోడ్‌మ్యాప్' },
    'nav.skills': { en: 'Skill Analyzer', hi: 'स्किल एनालाइज़र', ta: 'திறன் பகுப்பாய்வி', te: 'స్కిల్ అనలైజర్' },
    'nav.chat': { en: 'AI Chat', hi: 'AI चैट', ta: 'AI அரட்டை', te: 'AI చాట్' },
    'nav.community': { en: 'Community', hi: 'समुदाय', ta: 'சமூகம்', te: 'కమ్యూనిటీ' },
    'nav.settings': { en: 'Settings', hi: 'सेटिंग्स', ta: 'அமைப்புகள்', te: 'సెట్టింగ్స్' },
    'nav.help': { en: 'Help Center', hi: 'सहायता केंद्र', ta: 'உதவி மையம்', te: 'సహాయ కేంద్రం' },
    'nav.refer': { en: 'Refer & Earn', hi: 'रेफ़र करें और कमाएं', ta: 'பரிந்துரை & சம்பாதி', te: 'రిఫర్ & సంపాదించండి' },
    'nav.notifications': { en: 'Notifications', hi: 'सूचनाएं', ta: 'அறிவிப்புகள்', te: 'నోటిఫికేషన్లు' },
    'nav.analytics': { en: 'Analytics', hi: 'एनालिटिक्स', ta: 'பகுப்பாய்வு', te: 'అనలిటిక్స్' },
    'nav.network': { en: 'Network', hi: 'नेटवर्क', ta: 'நெட்வொர்க்', te: 'నెట్‌వర్క్' },
    'nav.leaderboard': { en: 'Leaderboard', hi: 'लीडरबोर्ड', ta: 'தரவரிசை', te: 'లీడర్‌బోర్డ్' },
    'nav.achievements': { en: 'Achievements', hi: 'उपलब्धियां', ta: 'சாதனைகள்', te: 'సాధనలు' },

    // ─── Dashboard ───
    'dash.welcome': { en: 'Welcome back', hi: 'वापसी पर स्वागत', ta: 'வரவேற்கிறோம்', te: 'తిరిగి స్వాగతం' },
    'dash.good_morning': { en: 'Good morning', hi: 'सुप्रभात', ta: 'காலை வணக்கம்', te: 'శుభోదయం' },
    'dash.good_afternoon': { en: 'Good afternoon', hi: 'शुभ दोपहर', ta: 'மதிய வணக்கம்', te: 'శుభ మధ్యాహ్నం' },
    'dash.good_evening': { en: 'Good evening', hi: 'शुभ संध्या', ta: 'மாலை வணக்கம்', te: 'శుభ సాయంత్రం' },
    'dash.streak': { en: 'Day Streak', hi: 'दिन का स्ट्रीक', ta: 'நாள் தொடர்ச்சி', te: 'డేస్ట్రీక్' },
    'dash.score_label': { en: 'Mentixy Score', hi: 'स्किलटेन स्कोर', ta: 'Mentixy மதிப்பெண்', te: 'Mentixy స్కోరు' },
    'dash.daily_quest': { en: 'Daily Quest', hi: 'आज का टास्क', ta: 'தினசரி பணி', te: 'డైలీ క్వెస్ట్' },
    'dash.explore': { en: 'Explore Tools', hi: 'टूल्स एक्सप्लोर करें', ta: 'கருவிகளை ஆராயுங்கள்', te: 'టూల్స్ ఎక్స్‌ప్లోర్ చేయండి' },
    'dash.progress': { en: 'Your Progress', hi: 'आपकी प्रगति', ta: 'உங்கள் முன்னேற்றம்', te: 'మీ ప్రగతి' },
    'dash.top_careers': { en: 'Top Career Matches', hi: 'टॉप करियर मैच', ta: 'சிறந்த தொழில் பொருத்தங்கள்', te: 'టాప్ కెరీర్ మ్యాచ్‌లు' },
    'dash.career_tools': { en: 'Career Tools', hi: 'करियर टूल्स', ta: 'தொழில் கருவிகள்', te: 'కెరీర్ టూల్స్' },
    'dash.opportunities': { en: 'Opportunities', hi: 'अवसर', ta: 'வாய்ப்புகள்', te: 'అవకాశాలు' },

    // ─── Assessment ───
    'assess.title': { en: 'Career DNA Assessment', hi: 'करियर DNA मूल्यांकन', ta: 'கரியர் DNA மதிப்பீடு', te: 'కెరీర్ DNA అంచనా' },
    'assess.subtitle': { en: 'Discover your career strengths in 25 minutes', hi: '25 मिनट में अपनी करियर ताकत जानें', ta: '25 நிமிடங்களில் உங்கள் தொழில் வலிமையைக் கண்டறியுங்கள்', te: '25 నిమిషాల్లో మీ కెరీర్ బలాన్ని కనుగొనండి' },
    'assess.start': { en: 'Start Assessment', hi: 'मूल्यांकन शुरू करें', ta: 'மதிப்பீட்டைத் தொடங்குங்கள்', te: 'అంచనా ప్రారంభించండి' },
    'assess.question': { en: 'Question', hi: 'प्रश्न', ta: 'கேள்வி', te: 'ప్రశ్న' },
    'assess.next': { en: 'Next', hi: 'अगला', ta: 'அடுத்து', te: 'తదుపరి' },
    'assess.prev': { en: 'Previous', hi: 'पिछला', ta: 'முந்தைய', te: 'మునుపటి' },
    'assess.submit': { en: 'Submit', hi: 'जमा करें', ta: 'சமர்ப்பிக்கவும்', te: 'సమర్పించండి' },
    'assess.honest_mirror': { en: 'Honest Mirror', hi: 'सच्चा आईना', ta: 'நேர்மையான கண்ணாடி', te: 'నిజాయితీ అద్దం' },

    // ─── Results ───
    'results.title': { en: 'Your Career DNA Results', hi: 'आपके करियर DNA रिजल्ट्स', ta: 'உங்கள் கரியர் DNA முடிவுகள்', te: 'మీ కెరీర్ DNA ఫలితాలు' },
    'results.top_match': { en: 'Top Career Match', hi: 'टॉप करियर मैच', ta: 'சிறந்த தொழில் பொருத்தம்', te: 'టాప్ కెరీర్ మ్యాచ్' },
    'results.strengths': { en: 'Your Strengths', hi: 'आपकी ताकत', ta: 'உங்கள் வலிமைகள்', te: 'మీ బలాలు' },
    'results.challenges': { en: 'Growth Areas', hi: 'सुधार के क्षेत्र', ta: 'வளர்ச்சி பகுதிகள்', te: 'అభివృద్ధి రంగాలు' },
    'results.share': { en: 'Share Your Card', hi: 'कार्ड शेयर करें', ta: 'உங்கள் அட்டையைப் பகிரவும்', te: 'మీ కార్డ్ షేర్ చేయండి' },
    'results.salary_range': { en: 'Expected Salary', hi: 'अपेक्षित सैलरी', ta: 'எதிர்பார்த்த சம்பளம்', te: 'ఆశించిన జీతం' },

    // ─── Coding ───
    'code.run': { en: 'Run Code', hi: 'कोड चलाएं', ta: 'குறியீட்டை இயக்கு', te: 'కోడ్ రన్ చేయండి' },
    'code.submit': { en: 'Submit Solution', hi: 'सॉल्यूशन जमा करें', ta: 'தீர்வை சமர்ப்பிக்கவும்', te: 'సొల్యూషన్ సమర్పించండి' },
    'code.solved': { en: 'Solved', hi: 'हल हुआ', ta: 'தீர்க்கப்பட்டது', te: 'పరిష్కరించబడింది' },
    'code.attempt': { en: 'attempts left', hi: 'प्रयास बाकी', ta: 'முயற்சிகள் மீதமுள்ளன', te: 'ప్రయత్నాలు మిగిలి ఉన్నాయి' },
    'code.hint': { en: 'Show Hint', hi: 'हिंट दिखाएं', ta: 'குறிப்பைக் காட்டு', te: 'హింట్ చూపించు' },
    'code.solution': { en: 'View Solution', hi: 'सॉल्यूशन देखें', ta: 'தீர்வைக் காண்', te: 'సొల్యూషన్ చూడండి' },
    'code.easy': { en: 'Easy', hi: 'आसान', ta: 'எளிது', te: 'సులభం' },
    'code.medium': { en: 'Medium', hi: 'मध्यम', ta: 'நடுத்தரம்', te: 'మధ్యస్థం' },
    'code.hard': { en: 'Hard', hi: 'कठिन', ta: 'கடினம்', te: 'కష్టం' },

    // ─── AI Chat ───
    'chat.placeholder': { en: 'Ask your career question...', hi: 'अपना करियर सवाल पूछें...', ta: 'உங்கள் தொழில் கேள்வியைக் கேளுங்கள்...', te: 'మీ కెరీర్ ప్రశ్న అడగండి...' },
    'chat.send': { en: 'Send', hi: 'भेजें', ta: 'அனுப்பு', te: 'పంపు' },
    'chat.thinking': { en: 'Thinking...', hi: 'सोच रहा हूं...', ta: 'யோசிக்கிறேன்...', te: 'ఆలోచిస్తున్నాను...' },
    'chat.suggestions': { en: 'Try asking', hi: 'ये पूछें', ta: 'இதை முயற்சிக்கவும்', te: 'ఇది అడగండి' },
    'chat.hindi_mode': { en: 'Chat in Hindi', hi: 'हिंदी में चैट करें', ta: 'இந்தியில் அரட்டை', te: 'హిందీలో చాట్' },

    // ─── Achievements ───
    'ach.title': { en: 'Achievements', hi: 'उपलब्धियां', ta: 'சாதனைகள்', te: 'సాధనలు' },
    'ach.unlocked': { en: 'Unlocked', hi: 'अनलॉक', ta: 'திறக்கப்பட்டது', te: 'అన్‌లాక్' },
    'ach.locked': { en: 'Locked', hi: 'लॉक', ta: 'பூட்டப்பட்டது', te: 'లాక్' },
    'ach.progress': { en: 'Progress', hi: 'प्रगति', ta: 'முன்னேற்றம்', te: 'ప్రగతి' },
    'ach.xp_earned': { en: 'XP Earned', hi: 'XP कमाया', ta: 'XP பெறப்பட்டது', te: 'XP సంపాదించారు' },

    // ─── Streak ───
    'streak.title': { en: 'Streak Tracker', hi: 'स्ट्रीक ट्रैकर', ta: 'தொடர்ச்சி டிராக்கர்', te: 'స్ట్రీక్ ట్రాకర్' },
    'streak.current': { en: 'Current Streak', hi: 'मौजूदा स्ट्रीक', ta: 'தற்போதைய தொடர்ச்சி', te: 'ప్రస్తుత స్ట్రీక్' },
    'streak.best': { en: 'Best Streak', hi: 'सबसे अच्छा स्ट्रीक', ta: 'சிறந்த தொடர்ச்சி', te: 'ఉత్తమ స్ట్రీక్' },
    'streak.freeze': { en: 'Streak Freeze', hi: 'स्ट्रीक फ़्रीज़', ta: 'தொடர்ச்சி உறைவு', te: 'స్ట్రీక్ ఫ్రీజ్' },
    'streak.at_risk': { en: 'At Risk!', hi: 'खतरे में!', ta: 'ஆபத்தில்!', te: 'ప్రమాదంలో!' },
    'streak.protected': { en: 'Protected', hi: 'सुरक्षित', ta: 'பாதுகாக்கப்பட்டது', te: 'రక్షించబడింది' },
    'streak.check_in': { en: 'Check In', hi: 'चेक इन', ta: 'செக் இன்', te: 'చెక్ ఇన్' },

    // ─── Leaderboard ───
    'lb.title': { en: 'Leaderboard', hi: 'लीडरबोर्ड', ta: 'தரவரிசை', te: 'లీడర్‌బోర్డ్' },
    'lb.overall': { en: 'Overall', hi: 'ओवरऑल', ta: 'ஒட்டுமொத்தம்', te: 'మొత్తం' },
    'lb.coding': { en: 'Coding', hi: 'कोडिंग', ta: 'கோடிங்', te: 'కోడింగ్' },
    'lb.college': { en: 'Colleges', hi: 'कॉलेज', ta: 'கல்லூரிகள்', te: 'కాలేజీలు' },
    'lb.weekly': { en: 'This Week', hi: 'इस हफ़्ते', ta: 'இந்த வாரம்', te: 'ఈ వారం' },
    'lb.your_rank': { en: 'Your Rank', hi: 'आपकी रैंक', ta: 'உங்கள் தரவரிசை', te: 'మీ ర్యాంక్' },

    // ─── Common Actions ───
    'action.save': { en: 'Save', hi: 'सेव करें', ta: 'சேமிக்கவும்', te: 'సేవ్ చేయండి' },
    'action.cancel': { en: 'Cancel', hi: 'रद्द करें', ta: 'ரத்து செய்', te: 'రద్దు చేయండి' },
    'action.delete': { en: 'Delete', hi: 'हटाएं', ta: 'நீக்கு', te: 'తొలగించు' },
    'action.edit': { en: 'Edit', hi: 'एडिट करें', ta: 'திருத்து', te: 'ఎడిట్ చేయండి' },
    'action.back': { en: 'Back', hi: 'वापस', ta: 'பின்செல்', te: 'వెనుకకు' },
    'action.continue': { en: 'Continue', hi: 'जारी रखें', ta: 'தொடர்', te: 'కొనసాగించు' },
    'action.copy': { en: 'Copy', hi: 'कॉपी करें', ta: 'நகலெடு', te: 'కాపీ చేయండి' },
    'action.share': { en: 'Share', hi: 'शेयर करें', ta: 'பகிர்', te: 'షేర్ చేయండి' },
    'action.download': { en: 'Download', hi: 'डाउनलोड', ta: 'பதிவிறக்கம்', te: 'డౌన్‌లోడ్' },
    'action.logout': { en: 'Logout', hi: 'लॉग आउट', ta: 'வெளியேறு', te: 'లాగ్అవుట్' },
    'action.search': { en: 'Search', hi: 'खोजें', ta: 'தேடு', te: 'శోధించు' },
    'action.filter': { en: 'Filter', hi: 'फ़िल्टर', ta: 'வடிகட்டு', te: 'ఫిల్టర్' },
    'action.view_all': { en: 'View All', hi: 'सभी देखें', ta: 'அனைத்தையும் காண்', te: 'అన్నీ చూడండి' },
    'action.try_again': { en: 'Try Again', hi: 'पुनः प्रयास करें', ta: 'மீண்டும் முயற்சிக்கவும்', te: 'మళ్ళీ ప్రయత్నించండి' },
    'action.go_home': { en: 'Go Home', hi: 'होम पर जाएं', ta: 'முகப்புக்கு செல்', te: 'హోమ్‌కి వెళ్ళండి' },

    // ─── Motivational ───
    'motivation.keep_going': { en: 'Keep going! 🔥', hi: 'लगे रहो! 🔥', ta: 'தொடருங்கள்! 🔥', te: 'కొనసాగించండి! 🔥' },
    'motivation.streak_risk': { en: "Don't break your streak!", hi: 'अपना स्ट्रीक मत तोड़ो!', ta: 'உங்கள் தொடர்ச்சியை உடைக்காதீர்கள்!', te: 'మీ స్ట్రీక్ విరవకండి!' },
    'motivation.daily': { en: "You've got this!", hi: 'तुम कर सकते हो!', ta: 'உங்களால் முடியும்!', te: 'మీరు చేయగలరు!' },
    'motivation.first_login': { en: 'Welcome to your career journey!', hi: 'आपकी करियर यात्रा में स्वागत है!', ta: 'உங்கள் தொழில் பயணத்தில் வரவேற்கிறோம்!', te: 'మీ కెరీర్ ప్రయాణానికి స్వాగతం!' },
    'motivation.congrats': { en: 'Congratulations! 🎉', hi: 'बधाई हो! 🎉', ta: 'வாழ்த்துக்கள்! 🎉', te: 'అభినందనలు! 🎉' },

    // ─── Empty States ───
    'empty.no_data': { en: 'No data yet', hi: 'अभी कोई डेटा नहीं', ta: 'இன்னும் தரவு இல்லை', te: 'ఇంకా డేటా లేదు' },
    'empty.start_now': { en: 'Get started now', hi: 'अभी शुरू करें', ta: 'இப்போதே தொடங்குங்கள்', te: 'ఇప్పుడే ప్రారంభించండి' },
    'empty.no_results': { en: 'No results found', hi: 'कोई परिणाम नहीं मिला', ta: 'முடிவுகள் கிடைக்கவில்லை', te: 'ఫలితాలు కనుగొనబడలేదు' },

    // ─── Parent Portal ───
    'parent.title': { en: 'Parent Intelligence Portal', hi: 'अभिभावक रिपोर्ट पोर्टल', ta: 'பெற்றோர் அறிக்கை போர்ட்டல்', te: 'తల్లిదండ్రుల ఇంటెలిజెన్స్ పోర్టల్' },
    'parent.summary': { en: 'Weekly Progress Summary', hi: 'साप्ताहिक प्रगति सारांश', ta: 'வாராந்திர முன்னேற்ற சுருக்கம்', te: 'వారపు ప్రగతి సారాంశం' },
    'parent.consent': { en: 'Student consent required', hi: 'छात्र की सहमति आवश्यक', ta: 'மாணவர் ஒப்புதல் தேவை', te: 'విద్యార్థి సమ్మతి అవసరం' },

    // ─── Referral ───
    'refer.title': { en: 'Refer & Earn', hi: 'रेफ़र करें और कमाएं', ta: 'பரிந்துரைத்து சம்பாதியுங்கள்', te: 'రిఫర్ చేసి సంపాదించండి' },
    'refer.your_link': { en: 'Your Referral Link', hi: 'आपका रेफ़रल लिंक', ta: 'உங்கள் பரிந்துரை இணைப்பு', te: 'మీ రిఫరల్ లింక్' },
    'refer.copy': { en: 'Copy Link', hi: 'लिंक कॉपी करें', ta: 'இணைப்பை நகலெடு', te: 'లింక్ కాపీ చేయండి' },
    'refer.share_whatsapp': { en: 'Share on WhatsApp', hi: 'WhatsApp पर शेयर करें', ta: 'WhatsApp-ல் பகிர்', te: 'WhatsApp లో షేర్ చేయండి' },
    'refer.rewards': { en: 'Reward Tiers', hi: 'पुरस्कार स्तर', ta: 'வெகுமதி நிலைகள்', te: 'రివార్డ్ టైర్లు' },

    // ─── Notifications ───
    'notif.title': { en: 'Notifications', hi: 'सूचनाएं', ta: 'அறிவிப்புகள்', te: 'నోటిఫికేషన్లు' },
    'notif.mark_all': { en: 'Mark All Read', hi: 'सभी पढ़े में चिन्हित करें', ta: 'அனைத்தையும் படிக்கப்பட்டதாக குறி', te: 'అన్నీ చదివినట్లు గుర్తించు' },
    'notif.clear': { en: 'Clear All', hi: 'सभी साफ़ करें', ta: 'அனைத்தையும் அழி', te: 'అన్నీ క్లియర్ చేయండి' },

    // ─── Community ───
    'community.title': { en: 'Student Community', hi: 'छात्र समुदाय', ta: 'மாணவர் சமூகம்', te: 'విద్యార్థి కమ్యూనిటీ' },
    'community.post': { en: 'Share something...', hi: 'कुछ शेयर करें...', ta: 'ஏதாவது பகிருங்கள்...', te: 'ఏదైనా షేర్ చేయండి...' },
    'community.rules': { en: 'Community Rules', hi: 'समुदाय नियम', ta: 'சமூக விதிகள்', te: 'కమ్యూనిటీ నియమాలు' },

    // ─── Onboarding ───
    'onboard.welcome': { en: 'Welcome to Mentixy! 🎉', hi: 'Mentixy में स्वागत है! 🎉', ta: 'Mentixy-க்கு வரவேற்கிறோம்! 🎉', te: 'Mentixy కి స్వాగతం! 🎉' },
    'onboard.college': { en: 'College', hi: 'कॉलेज', ta: 'கல்லூரி', te: 'కాలేజీ' },
    'onboard.year': { en: 'Year of Study', hi: 'अध्ययन वर्ष', ta: 'படிப்பு ஆண்டு', te: 'అధ్యయన సంవత్సరం' },
    'onboard.branch': { en: 'Branch', hi: 'शाखा', ta: 'கிளை', te: 'బ్రాంచ్' },
    'onboard.interests': { en: 'Your Interests', hi: 'आपकी रुचियां', ta: 'உங்கள் ஆர்வங்கள்', te: 'మీ ఆసక్తులు' },
    'onboard.skip': { en: 'Skip for now', hi: 'अभी छोड़ दें', ta: 'இப்போது தவிர்', te: 'ఇప్పుడు స్కిప్ చేయండి' },

    // ─── Error States ───
    'error.404_title': { en: 'Page Not Found', hi: 'पेज नहीं मिला', ta: 'பக்கம் கிடைக்கவில்லை', te: 'పేజీ కనుగొనబడలేదు' },
    'error.generic': { en: 'Something went wrong', hi: 'कुछ गड़बड़ हो गई', ta: 'ஏதோ தவறு நிகழ்ந்தது', te: 'ఏదో తప్పు జరిగింది' },
    'error.offline': { en: "You're offline", hi: 'आप ऑफ़लाइन हैं', ta: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள்', te: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు' },
};

/**
 * Get translated text for current locale.
 * Falls back: requested → en → key
 */
export function getText(key: string, locale: Locale = 'en'): string {
    return t[key]?.[locale] || t[key]?.en || key;
}

/**
 * Get all available locales
 */
export const LOCALES = [
    { code: 'en' as Locale, label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
    { code: 'hi' as Locale, label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta' as Locale, label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te' as Locale, label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳' },
];
