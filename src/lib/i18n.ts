import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "dashboard": "Dashboard",
        "agents": "AI Agents",
        "workflows": "Workflows",
        "reports": "Reports",
        "clients": "Clients",
        "billing": "Billing",
        "settings": "Settings"
      },
      "clients": {
        "subtitle": "Manage your business relationships and AI-driven CRM data.",
        "add_client": "Add Client",
        "name": "Company Name",
        "industry": "Industry",
        "email": "Email Address",
        "phone": "Phone Number",
        "details_desc": "Comprehensive view of client relationship and AI insights.",
        "contact_info": "Contact Information",
        "joined": "Joined",
        "ai_insights": "AI Insights",
        "sentiment_score": "Sentiment Score",
        "engagement": "Engagement Level",
        "quick_actions": "Quick Actions",
        "send_message": "Message",
        "view_crm": "CRM Link",
        "edit_client": "Edit Client Profile",
        "added_success": "Client added successfully!",
        "create": "Create Client",
        "add_desc": "Enter the details of the new business relationship.",
        "lifetime_value": "Lifetime Value",
        "growth": "Growth",
        "recent_activity": "Recent Activity",
        "messaging": "Opening messenger...",
        "opening_crm": "Redirecting to CRM...",
        "message_history": "Message History",
        "activity_summary": "Activity Summary",
        "client_status": "Client Status",
        "last_contact": "Last Contact",
        "next_followup": "Next Follow-up"
      },
      "workflows": {
        "subtitle": "Automate complex business processes with multi-agent chains.",
        "create_workflow": "Create Workflow",
        "trigger": "Trigger",
        "last_run": "Last run",
        "running": "Running",
        "create_desc": "Design a multi-agent process to automate your business tasks.",
        "name": "Workflow Name",
        "priority": "Priority",
        "select_agents": "Select Agents",
        "create": "Create Workflow",
        "details_desc": "Detailed execution metrics and configuration for this workflow.",
        "steps": "Workflow Steps",
        "run_now": "Run Workflow Now",
        "edit_config": "Edit Configuration",
        "created_success": "Workflow created successfully!"
      },
      "settings": {
        "subtitle": "Manage your organization, account, and system configurations.",
        "organization": "Organization",
        "org_desc": "Manage your business details and backend connection.",
        "company_name": "Company Name",
        "server_url": "Server Link (Flask Backend)",
        "save_changes": "Save Changes",
        "api_keys": "API Keys",
        "api_desc": "Use these keys to integrate with external systems.",
        "key_hint": "Keep this key secret. Do not share it in public repositories.",
        "regenerate_key": "Regenerate Key",
        "system_config": "System Configuration",
        "system_desc": "Fine-tune the AI OS behavior and performance.",
        "auto_enrich": "Auto-Enrich Leads",
        "auto_enrich_desc": "Automatically enrich new clients using AI.",
        "realtime_notif": "Real-time Notifications",
        "realtime_desc": "Receive instant alerts for critical events.",
        "send_test": "Send Test",
        "default_model": "Default AI Model",
        "saved_success": "Settings saved successfully!",
        "profile": "Profile",
        "notifications": "Notifications",
        "security": "Security",
        "appearance": "Appearance",
        "language_region": "Language & Region",
        "danger_zone": "Danger Zone",
        "danger_desc": "Irreversible actions related to your account.",
        "delete_account": "Delete Account"
      },
      "header": {
        "search": "Search agents, workflows, or data...",
        "notifications": "Notifications",
        "profile": "Profile",
        "signout": "Sign out",
        "plan": "PLAN"
      },
      "dashboard": {
        "title": "Executive Overview",
        "subtitle": "Real-time intelligence and autonomous agent performance.",
        "stats": {
          "ops": "AI Operations",
          "agents": "Active Agents",
          "roi": "Revenue ROI",
          "saved": "Time Saved"
        },
        "charts": {
          "throughput": "AI System Throughput"
        },
        "jobs": {
          "title": "Recent Operation Log",
          "viewAll": "View All Operations",
          "task_name": "Task Name",
          "agent": "Agent",
          "status": "Status",
          "duration": "Duration",
          "time": "Time"
        },
        "insights": {
          "title": "System Insights",
          "efficiency": "Automation Efficiency",
          "uptime": "System Uptime",
          "active_sessions": "Active Sessions"
        }
      },
      "agents": {
        "title": "AI Agent Command Center",
        "subtitle": "Deploy and manage autonomous agents for your business units.",
        "status": "Status",
        "ready": "Ready",
        "thinking": "Agent is thinking...",
        "placeholder": "Instruct {{name}}...",
        "history": "History",
        "settings": "Settings",
        "settings_title": "Agent Settings",
        "settings_desc": "Configure performance parameters and custom instructions for this agent.",
        "settings_language": "Response Language",
        "select_language": "Select language",
        "settings_temperature": "Temperature",
        "settings_tokens": "Max Output Tokens",
        "settings_prompt": "Custom System Prompt",
        "prompt_hint": "Leave empty to use the default agent personality.",
        "precise": "Precise",
        "creative": "Creative",
        "settings_saved": "Settings saved successfully",
        "overview": "Overview",
        "performance_metrics": "Performance Metrics",
        "success_rate": "Success Rate",
        "avg_response": "Avg. Response",
        "current_config": "Current Configuration",
        "recent_history": "Recent History",
        "no_history": "No execution history found.",
        "run_task": "Run Task",
        "edit_config": "Edit Config"
      },
      "reports": {
        "title": "Intelligence Reports",
        "subtitle": "Comprehensive analysis of AI operations and business impact.",
        "last_30_days": "Last 30 Days",
        "export": "Export PDF",
        "total_tasks": "Total Tasks",
        "ai_efficiency": "AI Efficiency",
        "hours_saved": "Hours Saved",
        "active_users": "Active Clients",
        "task_throughput": "System Throughput",
        "task_throughput_desc": "Daily task execution volume across all agents.",
        "agent_usage": "Agent Distribution",
        "agent_usage_desc": "Workload share by agent type.",
        "agent_performance": "Agent Performance Analytics",
        "performance_desc": "Detailed metrics on individual agent efficiency and workload.",
        "completion_rate": "Completion Rate",
        "avg_response_time": "Avg. Response Time",
        "utilization": "Utilization",
        "recent_executions": "Detailed Execution Logs",
        "recent_executions_desc": "Comprehensive list of recent AI agent activities.",
        "filter": "Filter",
        "agent": "Agent",
        "task": "Task Type",
        "status": "Status",
        "duration": "Duration",
        "timestamp": "Timestamp",
        "no_results": "No matching logs found.",
        "export_success": "Report exported successfully!"
      },
      "billing": {
        "upgrading": "Upgrading to",
        "current_plan": "Current Plan",
        "upgrade_now": "Upgrade Now",
        "downloading": "Downloading invoice..."
      },
      "common": {
        "done": "Done",
        "search": "Search...",
        "all": "All",
        "reset": "Reset Filters",
        "cancel": "Cancel",
        "actions": "Actions",
        "edit": "Edit",
        "delete": "Delete",
        "delete_confirm": "Delete action initiated",
        "roles": {
          "admin": "Administrator",
          "manager": "Manager",
          "user": "Regular User"
        }
      },
      "landing": {
        "login": "Login",
        "getStarted": "Get Started",
        "badge": "Next-Gen Autonomous Enterprise",
        "heroTitle1": "The Future of",
        "heroTitle2": "Business Intelligence",
        "heroSubtitle": "Experience the world's most advanced AI operating system. Designed to automate, analyze, and accelerate your enterprise with unprecedented precision.",
        "enterSystem": "Enter the System",
        "watchDemo": "Watch Demo",
        "features": {
          "speed": {
            "title": "Quantum Speed",
            "desc": "Execute complex workflows in milliseconds with our optimized neural processing engine."
          },
          "security": {
            "title": "Fortress Security",
            "desc": "Military-grade encryption and isolated agent environments ensure your data remains sovereign."
          },
          "intelligence": {
            "title": "Neural Insights",
            "desc": "Real-time predictive analytics that anticipate market shifts before they happen."
          }
        }
      }
    }
  },
  ar: {
    translation: {
      "nav": {
        "dashboard": "لوحة التحكم",
        "agents": "وكلاء الذكاء الاصطناعي",
        "workflows": "سير العمل",
        "reports": "التقارير",
        "clients": "العملاء",
        "billing": "الفواتير",
        "settings": "الإعدادات"
      },
      "clients": {
        "subtitle": "إدارة علاقاتك التجارية وبيانات CRM المدعومة بالذكاء الاصطناعي.",
        "add_client": "إضافة عميل",
        "name": "اسم الشركة",
        "industry": "الصناعة",
        "email": "البريد الإلكتروني",
        "phone": "رقم الهاتف",
        "details_desc": "عرض شامل لعلاقة العميل ورؤى الذكاء الاصطناعي.",
        "contact_info": "معلومات الاتصال",
        "joined": "انضم في",
        "ai_insights": "رؤى الذكاء الاصطناعي",
        "sentiment_score": "درجة المشاعر",
        "engagement": "مستوى التفاعل",
        "quick_actions": "إجراءات سريعة",
        "send_message": "رسالة",
        "view_crm": "رابط CRM",
        "edit_client": "تعديل ملف العميل",
        "added_success": "تم إضافة العميل بنجاح!",
        "create": "إنشاء عميل",
        "add_desc": "أدخل تفاصيل علاقة العمل الجديدة.",
        "lifetime_value": "القيمة الدائمة",
        "growth": "النمو",
        "recent_activity": "النشاط الأخير",
        "messaging": "جاري فتح المراسلات...",
        "opening_crm": "جاري التوجيه إلى CRM...",
        "message_history": "سجل الرسائل",
        "activity_summary": "موجز النشاط",
        "client_status": "حالة العميل",
        "last_contact": "آخر اتصال",
        "next_followup": "المتابعة القادمة"
      },
      "workflows": {
        "subtitle": "أتمتة العمليات التجارية المعقدة باستخدام سلاسل الوكلاء المتعددة.",
        "create_workflow": "إنشاء سير عمل",
        "trigger": "المحفز",
        "last_run": "آخر تشغيل",
        "running": "جاري التشغيل",
        "create_desc": "تصميم عملية متعددة الوكلاء لأتمتة مهام عملك.",
        "name": "اسم سير العمل",
        "priority": "الأولوية",
        "select_agents": "اختر الوكلاء",
        "create": "إنشاء سير عمل",
        "details_desc": "مقاييس التنفيذ التفصيلية والتكوين لسير العمل هذا.",
        "steps": "خطوات سير العمل",
        "run_now": "تشغيل سير العمل الآن",
        "edit_config": "تعديل التكوين",
        "created_success": "تم إنشاء سير العمل بنجاح!"
      },
      "settings": {
        "subtitle": "إدارة المؤسسة والحساب وتكوينات النظام.",
        "organization": "المؤسسة",
        "org_desc": "إدارة تفاصيل عملك واتصال الخادم الخلفي.",
        "company_name": "اسم الشركة",
        "server_url": "رابط الخادم (Flask Backend)",
        "save_changes": "حفظ التغييرات",
        "api_keys": "مفاتيح API",
        "api_desc": "استخدم هذه المفاتيح للتكامل مع الأنظمة الخارجية.",
        "key_hint": "حافظ على سرية هذا المفتاح. لا تشاركه في المستودعات العامة.",
        "regenerate_key": "إعادة إنشاء المفتاح",
        "system_config": "تكوين النظام",
        "system_desc": "ضبط سلوك وأداء نظام الذكاء الاصطناعي.",
        "auto_enrich": "إثراء العملاء تلقائياً",
        "auto_enrich_desc": "إثراء العملاء الجدد تلقائياً باستخدام الذكاء الاصطناعي.",
        "realtime_notif": "إشعارات فورية",
        "realtime_desc": "تلقي تنبيهات فورية للأحداث الهامة.",
        "send_test": "إرسال تجربة",
        "default_model": "نموذج الذكاء الاصطناعي الافتراضي",
        "saved_success": "تم حفظ الإعدادات بنجاح!",
        "profile": "الملف الشخصي",
        "notifications": "الإشعارات",
        "security": "الأمان",
        "appearance": "المظهر",
        "language_region": "اللغة والمنطقة",
        "danger_zone": "منطقة الخطر",
        "danger_desc": "إجراءات غير قابلة للتراجع تتعلق بحسابك.",
        "delete_account": "حذف الحساب"
      },
      "header": {
        "search": "البحث عن وكلاء، سير عمل، أو بيانات...",
        "notifications": "التنبيهات",
        "profile": "الملف الشخصي",
        "signout": "تسجيل الخروج",
        "plan": "خطة"
      },
      "dashboard": {
        "title": "نظرة عامة تنفيذية",
        "subtitle": "الذكاء في الوقت الفعلي وأداء الوكلاء المستقلين.",
        "stats": {
          "ops": "عمليات الذكاء الاصطناعي",
          "agents": "الوكلاء النشطون",
          "roi": "عائد الاستثمار",
          "saved": "الوقت الموفر"
        },
        "charts": {
          "throughput": "إنتاجية نظام الذكاء الاصطناعي"
        },
        "jobs": {
          "title": "سجل العمليات الأخير",
          "viewAll": "عرض جميع العمليات",
          "task_name": "اسم المهمة",
          "agent": "الوكيل",
          "status": "الحالة",
          "duration": "المدة",
          "time": "الوقت"
        },
        "insights": {
          "title": "رؤى النظام",
          "efficiency": "كفاءة الأتمتة",
          "uptime": "وقت التشغيل",
          "active_sessions": "الجلسات النشطة"
        }
      },
      "agents": {
        "title": "مركز قيادة وكلاء الذكاء الاصطناعي",
        "subtitle": "نشر وإدارة الوكلاء المستقلين لوحدات عملك.",
        "status": "الحالة",
        "ready": "جاهز",
        "thinking": "الوكيل يفكر...",
        "placeholder": "أعطِ تعليمات لـ {{name}}...",
        "history": "السجل",
        "settings": "الإعدادات",
        "settings_title": "إعدادات الوكيل",
        "settings_desc": "تكوين معلمات الأداء والتعليمات المخصصة لهذا الوكيل.",
        "settings_language": "لغة الاستجابة",
        "select_language": "اختر اللغة",
        "settings_temperature": "درجة الحرارة (Temperature)",
        "settings_tokens": "أقصى عدد للرموز (Tokens)",
        "settings_prompt": "تعليمات النظام المخصصة",
        "prompt_hint": "اتركه فارغاً لاستخدام الشخصية الافتراضية للوكيل.",
        "precise": "دقيق",
        "creative": "إبداعي",
        "settings_saved": "تم حفظ الإعدادات بنجاح",
        "overview": "نظرة عامة",
        "performance_metrics": "مقاييس الأداء",
        "success_rate": "معدل النجاح",
        "avg_response": "متوسط الاستجابة",
        "current_config": "التكوين الحالي",
        "recent_history": "السجل الأخير",
        "no_history": "لم يتم العثور على سجل تنفيذ.",
        "run_task": "تشغيل مهمة",
        "edit_config": "تعديل التكوين",
        "add_agent": "إضافة وكيل جديد",
        "add_agent_desc": "أنشئ وكيل ذكاء اصطناعي متخصص بشخصية وأهداف مخصصة.",
        "agent_name": "اسم الوكيل",
        "agent_desc": "الوصف",
        "agent_prompt": "تعليمات النظام",
        "agent_icon": "نوع الأيقونة",
        "create_agent": "إنشاء الوكيل",
        "agent_created": "تم إنشاء الوكيل بنجاح"
      },
      "reports": {
        "title": "تقارير الذكاء",
        "subtitle": "تحليل شامل لعمليات الذكاء الاصطناعي وتأثيرها على العمل.",
        "last_30_days": "آخر 30 يومًا",
        "export": "تصدير PDF",
        "total_tasks": "إجمالي المهام",
        "ai_efficiency": "كفاءة الذكاء الاصطناعي",
        "hours_saved": "الساعات الموفرة",
        "active_users": "العملاء النشطون",
        "task_throughput": "إنتاجية النظام",
        "task_throughput_desc": "حجم تنفيذ المهام اليومي عبر جميع الوكلاء.",
        "agent_usage": "توزيع الوكلاء",
        "agent_usage_desc": "حصة عبء العمل حسب نوع الوكيل.",
        "agent_performance": "تحليلات أداء الوكلاء",
        "performance_desc": "مقاييس مفصلة حول كفاءة الوكلاء الفرديين وحجم العمل.",
        "completion_rate": "معدل الإكمال",
        "avg_response_time": "متوسط وقت الاستجابة",
        "utilization": "الاستخدام",
        "recent_executions": "سجلات التنفيذ التفصيلية",
        "recent_executions_desc": "قائمة شاملة لأنشطة وكلاء الذكاء الاصطناعي الأخيرة.",
        "filter": "تصفية",
        "agent": "الوكيل",
        "task": "نوع المهمة",
        "status": "الحالة",
        "duration": "المدة",
        "timestamp": "الطابع الزمني",
        "no_results": "لم يتم العثور على سجلات مطابقة.",
        "export_success": "تم تصدير التقرير بنجاح!"
      },
      "billing": {
        "upgrading": "جاري الترقية إلى",
        "current_plan": "الخطة الحالية",
        "upgrade_now": "ترقية الآن",
        "downloading": "جاري تحميل الفاتورة..."
      },
      "common": {
        "done": "تم",
        "search": "بحث...",
        "all": "الكل",
        "reset": "إعادة ضبط التصفية",
        "cancel": "إلغاء",
        "actions": "الإجراءات",
        "edit": "تعديل",
        "delete": "حذف",
        "delete_confirm": "تم بدء إجراء الحذف",
        "roles": {
          "admin": "مدير النظام",
          "manager": "مدير",
          "user": "مستخدم عادي"
        }
      },
      "landing": {
        "login": "تسجيل الدخول",
        "getStarted": "ابدأ الآن",
        "badge": "الجيل القادم من المؤسسات المستقلة",
        "heroTitle1": "مستقبل",
        "heroTitle2": "ذكاء الأعمال",
        "heroSubtitle": "اختبر نظام تشغيل الذكاء الاصطناعي الأكثر تقدماً في العالم. صُمم لأتمتة وتحليل وتسريع مؤسستك بدقة غير مسبوقة.",
        "enterSystem": "دخول النظام",
        "watchDemo": "مشاهدة العرض",
        "features": {
          "speed": {
            "title": "سرعة فائقة",
            "desc": "نفذ تدفقات العمل المعقدة في أجزاء من الثانية باستخدام محرك المعالجة العصبية المحسن لدينا."
          },
          "security": {
            "title": "أمان حصين",
            "desc": "تضمن تقنيات التشفير العسكرية وبيئات الوكلاء المعزولة بقاء بياناتك تحت سيادتك الكاملة."
          },
          "intelligence": {
            "title": "رؤى عصبية",
            "desc": "تحليلات تنبؤية في الوقت الفعلي تتوقع تحولات السوق قبل حدوثها."
          }
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Update document direction on language change
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Set initial direction
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language;

export default i18n;
