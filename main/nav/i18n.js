/* ==========================================================================
   i18n.js — English / Arabic interface localization for IStories
   ==========================================================================
   Loaded on every page (classic script, no build step).

   What it does
   ------------
   1. Stores the chosen interface language in localStorage (`istories_lang`).
   2. Sets <html lang> and <html dir> ("ltr" / "rtl") immediately and again
      after every language change.
   3. Translates elements with data-i18n / data-i18n-placeholder /
      data-i18n-aria-label / data-i18n-title / data-i18n-html.
   4. Also translates matching static UI phrases (buttons, labels, option
      text, tooltips) automatically, including content added later by page
      scripts. Story text, story titles and user content are always skipped.
   5. Dispatches `ist-language-change` so pages can re-render dynamic text.

   Adding a translation
   --------------------
   Add a key to MESSAGES below, then use it in HTML:
       <h2 data-i18n="settings.appearance">Appearance</h2>
   For one-off static strings that are already written in English in the
   markup, add the pair to STATIC_PHRASES — no markup change is needed.
   ========================================================================== */
(function () {
    'use strict';

    var LANG_KEY = 'istories_lang';
    var SUPPORTED = ['en', 'ar'];
    var html = document.documentElement;

    /* ----------------------------------------------------------------------
       Message catalogue — [English, Arabic]
       ---------------------------------------------------------------------- */
    var MESSAGES = {
        /* Navigation / shared chrome */
        'nav.home': ['Home', 'الرئيسية'],
        'nav.learn': ['Learn', 'تعلّم'],
        'nav.stories': ['Story Library', 'مكتبة القصص'],
        'nav.myStories': ['My Stories', 'قصصي'],
        'nav.vocabulary': ['Vocabulary', 'المفردات'],
        'nav.flashcards': ['Flashcards', 'البطاقات التعليمية'],
        'nav.quiz': ['Quiz', 'اختبار'],
        'nav.create': ['Create', 'أنشئ'],
        'nav.studio': ['Stories Studio', 'استوديو القصص'],
        'nav.profile': ['Profile', 'الملف الشخصي'],
        'nav.discover': ['Discover', 'اكتشف'],
        'nav.store': ['Story Store', 'متجر القصص'],
        'nav.tools': ['Tools', 'الأدوات'],
        'nav.translation': ['Translation', 'الترجمة'],
        'nav.csvTranslator': ['CSV → Dictionary', 'CSV → قاموس'],
        'nav.analyzer': ['Text Analyzer', 'محلل النصوص'],
        'nav.system': ['System', 'النظام'],
        'nav.bases': ['Story Bases', 'قواعد القصص'],
        'nav.settings': ['Settings', 'الإعدادات'],
        'nav.theme': ['Theme', 'المظهر'],
        'nav.top': ['Top', 'أعلى'],
        'nav.help': ['Help & guide', 'المساعدة والدليل'],
        'nav.language': ['Language', 'اللغة'],
        'nav.mainNavigation': ['Main navigation', 'التنقل الرئيسي'],
        'nav.open': ['Open navigation', 'فتح التنقل'],
        'nav.close': ['Close navigation', 'إغلاق التنقل'],
        'nav.collapse': ['Collapse navigation', 'طيّ التنقل'],
        'nav.expand': ['Expand navigation', 'توسيع التنقل'],

        /* Generic actions */
        'action.close': ['Close', 'إغلاق'],
        'action.cancel': ['Cancel', 'إلغاء'],
        'action.save': ['Save', 'حفظ'],
        'action.saveChanges': ['Save Changes', 'حفظ التغييرات'],
        'action.saveStory': ['Save Story', 'حفظ القصة'],
        'action.delete': ['Delete', 'حذف'],
        'action.edit': ['Edit', 'تعديل'],
        'action.read': ['Read', 'قراءة'],
        'action.export': ['Export', 'تصدير'],
        'action.import': ['Import', 'استيراد'],
        'action.reset': ['Reset', 'إعادة ضبط'],
        'action.clear': ['Clear', 'مسح'],
        'action.preview': ['Preview', 'معاينة'],
        'action.download': ['Download', 'تنزيل'],
        'action.upload': ['Upload', 'رفع'],
        'action.browse': ['Browse Files', 'تصفح الملفات'],
        'action.search': ['Search', 'بحث'],
        'action.back': ['Back', 'رجوع'],
        'action.next': ['Next', 'التالي'],
        'action.previous': ['Previous', 'السابق'],
        'action.submit': ['Submit Quiz', 'إرسال الاختبار'],
        'action.start': ['Start', 'ابدأ'],
        'action.done': ['Done', 'تم'],
        'action.refresh': ['Refresh', 'تحديث'],
        'action.copy': ['Copy', 'نسخ'],
        'action.loadMore': ['Load 20 more stories', 'تحميل 20 قصة إضافية'],
        'action.loading': ['Loading…', 'جارٍ التحميل…'],
        'action.tryAgain': ['Try again', 'حاول مرة أخرى'],
        'action.open': ['Open', 'فتح'],
        'action.continue': ['Continue', 'متابعة'],

        /* Common words */
        'common.all': ['All', 'الكل'],
        'common.allLanguages': ['All languages', 'كل اللغات'],
        'common.language': ['Language', 'اللغة'],
        'common.level': ['Level', 'المستوى'],
        'common.words': ['Words', 'الكلمات'],
        'common.word': ['Word', 'كلمة'],
        'common.days': ['days', 'أيام'],
        'common.audio': ['Audio', 'صوت'],
        'common.author': ['Author', 'المؤلف'],
        'common.anonymous': ['Anonymous', 'مجهول'],
        'common.none': ['None', 'لا شيء'],
        'common.optional': ['Optional', 'اختياري'],
        'common.custom': ['Custom', 'مخصص'],
        'common.remove': ['Remove', 'إزالة'],
        'common.removeAll': ['Remove all', 'إزالة الكل'],
        'common.selectAll': ['Select all', 'تحديد الكل'],
        'common.source': ['Source', 'المصدر'],
        'common.tags': ['Tags', 'الوسوم'],
        'common.title': ['Title', 'العنوان'],
        'common.description': ['Description', 'الوصف'],
        'common.yes': ['Yes', 'نعم'],
        'common.no': ['No', 'لا'],
        'common.name': ['Name', 'الاسم'],

        /* Story language names */
        'lang.en': ['English', 'الإنجليزية'],
        'lang.fr': ['French', 'الفرنسية'],
        'lang.es': ['Spanish', 'الإسبانية'],
        'lang.de': ['German', 'الألمانية'],
        'lang.it': ['Italian', 'الإيطالية'],
        'lang.pt': ['Portuguese', 'البرتغالية'],
        'lang.ru': ['Russian', 'الروسية'],
        'lang.tr': ['Turkish', 'التركية'],
        'lang.ar': ['Arabic', 'العربية'],
        'lang.fa': ['Persian', 'الفارسية'],
        'lang.ur': ['Urdu', 'الأردية'],
        'lang.zh': ['Chinese', 'الصينية'],
        'lang.ja': ['Japanese', 'اليابانية'],
        'lang.ko': ['Korean', 'الكورية'],
        'lang.hi': ['Hindi', 'الهندية'],
        'lang.nl': ['Dutch', 'الهولندية'],
        'lang.pl': ['Polish', 'البولندية'],
        'lang.sv': ['Swedish', 'السويدية'],
        'lang.el': ['Greek', 'اليونانية'],
        'lang.he': ['Hebrew', 'العبرية'],

        /* Home page */
        'home.eyebrow': ['Stories that teach you a language', 'قصص تعلّمك لغة'],
        'home.titleStart': ['Learn Languages Through', 'تعلّم اللغات من خلال'],
        'home.titleHighlight': ['Interactive Stories', 'قصص تفاعلية'],
        'home.subtitle': ['Improve your language skills by reading engaging stories with instant translations, definitions, and audio support — one tap away.', 'طوّر مهاراتك اللغوية بقراءة قصص مشوقة مع ترجمات فورية وتعريفات ودعم صوتي — كل ذلك بنقرة واحدة.'],
        'home.startLearning': ['Start learning', 'ابدأ التعلّم'],
        'home.seeInside': ["See what's inside", 'اكتشف ما بالداخل'],
        'home.tagLanguages': ['19 languages', '19 لغة'],
        'home.tagAudio': ['Audio narration', 'سرد صوتي'],
        'home.tagVocabulary': ['Vocabulary & flashcards', 'مفردات وبطاقات تعليمية'],
        'home.introEyebrow': ['Introduction', 'مقدمة'],
        'home.introTitle': ['See IStories in action', 'شاهد IStories أثناء العمل'],
        'home.introText': ['A quick look at how IStories turns everyday reading into real language practice — instant translations, audio and vocabulary, all in one place.', 'نظرة سريعة على كيف يحوّل IStories القراءة اليومية إلى تدريب لغوي حقيقي — ترجمات فورية وصوت ومفردات، كل ذلك في مكان واحد.'],
        'home.featureTranslateTitle': ['Instant translations', 'ترجمة فورية'],
        'home.featureTranslateText': ['Tap any word in a story to see its meaning in your own language, right where you are reading.', 'انقر على أي كلمة في القصة لترى معناها بلغتك مباشرةً حيث تقرأ.'],
        'home.featureAudioTitle': ['Listen & repeat', 'استمع وأعد'],
        'home.featureAudioText': ['Every story can be read aloud with built-in speech, so you hear the pronunciation as you go.', 'يمكن قراءة كل قصة بصوت مسموع عبر النطق المدمج، فتسمع اللفظ أثناء التقدم.'],
        'home.featureVocabTitle': ['Vocabulary & flashcards', 'مفردات وبطاقات تعليمية'],
        'home.featureVocabText': ['Save new words as you read, then review them with flashcards until they really stick.', 'احفظ الكلمات الجديدة أثناء القراءة، ثم راجعها بالبطاقات التعليمية حتى ترسخ.'],
        'home.featureStudioTitle': ['Stories Studio', 'استوديو القصص'],
        'home.featureStudioText': ['Create your own interactive stories in any language and level, then share them with everyone.', 'أنشئ قصصك التفاعلية بأي لغة ومستوى، ثم شاركها مع الجميع.'],
        'home.about': ['About', 'عن الموقع'],
        'home.by': ['By : Ammar chacal', 'بواسطة: عمار شقل'],
        'home.videoFallback': ['Your browser does not support the video tag.', 'متصفحك لا يدعم وسم الفيديو.'],

        /* Library */
        'library.title': ['Story Library', 'مكتبة القصص'],
        'library.searchPlaceholder': ['Search stories', 'ابحث عن قصص'],
        'library.searchAria': ['Search stories', 'ابحث عن قصص'],
        'library.random': ['Random Story', 'قصة عشوائية'],
        'library.recent': ['Recent Stories', 'القصص الأخيرة'],
        'library.beginner': ['Beginner', 'مبتدئ'],
        'library.intermediate': ['Intermediate', 'متوسط'],
        'library.advanced': ['Advanced', 'متقدم'],
        'library.filterLevel': ['Filter by level', 'تصفية حسب المستوى'],
        'library.filterLanguage': ['Filter stories by language', 'تصفية القصص حسب اللغة'],
        'library.loadMore': ['Load 20 more stories', 'تحميل 20 قصة إضافية'],
        'library.showing': ['Showing {shown} of {total} stories', 'عرض {shown} من {total} قصة'],
        'library.noStoriesLevel': ['No stories found for this level', 'لم يتم العثور على قصص لهذا المستوى'],
        'library.noStoriesLevelLang': ['No stories found for this level in {language}', 'لم يتم العثور على قصص لهذا المستوى باللغة {language}'],
        'library.noResults': ['No stories found for "{query}"', 'لم يتم العثور على قصص لـ "{query}"'],
        'library.tryKeywords': ['Try different keywords or browse all stories', 'جرّب كلمات مختلفة أو تصفح جميع القصص'],
        'library.tryLanguage': ['Try another language or level.', 'جرّب لغة أو مستوى آخر.'],
        'library.tryLevel': ['Try a different level!', 'جرّب مستوى آخر!'],
        'library.storyLanguage': ['Story language', 'لغة القصة'],
        'library.wordsCount': ['{count} words', '{count} كلمة'],
        'library.minRead': ['{count} min read', '{count} دقيقة قراءة'],
        'library.userStory': ['Your Story', 'قصتك'],
        'library.sourcesTitle': ['Story sources', 'مصادر القصص'],
        'library.sourcesHelp': ['Choose an offline base or a saved online base, or add a file URL.', 'اختر قاعدة غير متصلة أو قاعدة متصلة محفوظة، أو أضف رابط ملف.'],
        'library.addSourceUrl': ['Add a file URL', 'أضف رابط ملف'],
        'library.sourceUrlPlaceholder': ['https://example.com/stories.js', 'https://example.com/stories.js'],
        'library.loadSource': ['Load', 'تحميل'],
        'library.sourceInvalid': ['Enter a valid http(s) file URL.', 'أدخل رابط ملف صالحًا (http/https).'],
        'library.offlineBases': ['Offline bases', 'القواعد غير المتصلة'],
        'library.onlineBases': ['Your online bases', 'قواعدك المتصلة'],
        'library.onlineBasesEmpty': ['No online bases saved yet. Add one below or browse the database.', 'لا توجد قواعد متصلة محفوظة بعد. أضف واحدة أدناه أو تصفح قاعدة البيانات.'],
        'library.browseDatabase': ['Browse the story database', 'تصفح قاعدة بيانات القصص'],
        'library.browseDatabaseDesc': ['Find ready-made bases and load them here.', 'اعثر على قواعد جاهزة وحمّلها هنا.'],
        'library.removeSource': ['Remove saved base', 'حذف القاعدة المحفوظة'],
        'library.builtInBadge': ['Built-in', 'مدمج'],
        'library.importedBadge': ['Imported', 'مستورد'],
        'library.importLocalBase': ['Import from local base JS file', 'استيراد من ملف قاعدة JS محلي'],
        'library.chooseLocalBase': ['Choose a .js file', 'اختر ملف .js'],
        'library.localBaseHint': ['The file is saved in this browser and is never uploaded.', 'يُحفظ الملف في هذا المتصفح ولا يُرفع إلى أي مكان.'],
        'library.localBases': ['Local bases', 'القواعد المحلية'],
        'library.localBasesEmpty': ['No local bases imported yet. Use the import field below.', 'لا توجد قواعد محلية مستوردة بعد. استخدم حقل الاستيراد أدناه.'],
        'library.localBaseInvalid': ['That file is not a valid story base.', 'هذا الملف ليس قاعدة قصص صالحة.'],
        'library.localBaseImporting': ['Importing…', 'جارٍ الاستيراد…'],
        'library.baseStoryCount': ['{count} stories', '{count} قصة'],
        'library.manageBases': ['Manage bases', 'إدارة القواعد'],
        'library.localBaseMissing': ['The local base for this story is not available on this device.', 'القاعدة المحلية لهذه القصة غير متاحة على هذا الجهاز.'],
        'library.baseUnavailable': ['The base for this story is no longer available.', 'قاعدة هذه القصة لم تعد متاحة.'],
        'library.baseStoryMissing': ['That story is no longer in its base.', 'هذه القصة لم تعد موجودة في قاعدتها.'],
        'library.storyLoadFailed': ['The story could not be opened. Please reload the page and try again.', 'تعذّر فتح القصة. أعد تحميل الصفحة وحاول مرة أخرى.'],

        /* Base manager */
        'bases.title': ['Story Bases', 'قواعد القصص'],
        'bases.eyebrow': ['Manage your library sources', 'إدارة مصادر مكتبتك'],
        'bases.heroTitle': ['Story bases', 'قواعد القصص'],
        'bases.heroText': ['Import local .js bases, save online bases, and control what feeds the Story Library. Everything is kept in this browser.', 'استورد قواعد .js المحلية، واحفظ القواعد المتصلة، وتحكم في مصادر مكتبة القصص. كل شيء محفوظ في هذا المتصفح.'],
        'bases.statBases': ['Bases', 'القواعد'],
        'bases.statStories': ['Local stories', 'قصص محلية'],
        'bases.statLocal': ['Local', 'محلية'],
        'bases.statOnline': ['Online', 'متصلة'],
        'bases.yourBases': ['Your bases', 'قواعدك'],
        'bases.yourBasesDesc': ['Built-in bases ship with the app. Local and online bases are yours to add or remove.', 'القواعد المدمجة تأتي مع التطبيق. القواعد المحلية والمتصلة يمكنك إضافتها أو حذفها.'],
        'bases.loading': ['Loading bases…', 'جارٍ تحميل القواعد…'],
        'bases.builtIn': ['Built-in', 'مدمجة'],
        'bases.local': ['Local file', 'ملف محلي'],
        'bases.online': ['Online', 'متصلة'],
        'bases.addLocal': ['Add a local base', 'إضافة قاعدة محلية'],
        'bases.addLocalDesc': ['Choose a .js database from your device. It is stored in this browser and works offline.', 'اختر قاعدة بيانات .js من جهازك. تُحفظ في هذا المتصفح وتعمل دون اتصال.'],
        'bases.chooseFile': ['Choose a .js file', 'اختر ملف .js'],
        'bases.noFile': ['No file chosen yet', 'لم يتم اختيار ملف بعد'],
        'bases.optionalName': ['Name (optional)', 'الاسم (اختياري)'],
        'bases.namePlaceholder': ['e.g. My English base', 'مثال: قاعدتي الإنجليزية'],
        'bases.addLocalButton': ['Add local base', 'إضافة القاعدة المحلية'],
        'bases.addOnline': ['Add an online base', 'إضافة قاعدة متصلة'],
        'bases.addOnlineDesc': ['Paste a link to a story database (.js). The app loads it when selected and remembers it here.', 'الصق رابط قاعدة قصص (.js). يحمّلها التطبيق عند اختيارها ويتذكرها هنا.'],
        'bases.urlLabel': ['Base URL', 'رابط القاعدة'],
        'bases.labelLabel': ['Name (optional)', 'الاسم (اختياري)'],
        'bases.labelPlaceholder': ['e.g. Community stories', 'مثال: قصص المجتمع'],
        'bases.addOnlineButton': ['Add online base', 'إضافة القاعدة المتصلة'],
        'bases.openLibrary': ['Open in library', 'فتح في المكتبة'],
        'bases.export': ['Export', 'تصدير'],
        'bases.delete': ['Delete', 'حذف'],
        'bases.deleteLocalConfirm': ['Delete the local base "{name}"? The file will be removed from this browser.', 'حذف القاعدة المحلية "{name}"؟ سيُزال الملف من هذا المتصفح.'],
        'bases.deleteOnlineConfirm': ['Remove the online base "{name}" from this list?', 'إزالة القاعدة المتصلة "{name}" من هذه القائمة؟'],
        'bases.empty': ['No custom bases yet', 'لا توجد قواعد مخصصة بعد'],
        'bases.emptyText': ['Add a local .js file or an online base below.', 'أضف ملف .js محليًا أو قاعدة متصلة أدناه.'],
        'bases.importing': ['Reading the base…', 'جارٍ قراءة القاعدة…'],
        'bases.importedOk': ['Added "{name}" with {count} stories.', 'تمت إضافة "{name}" مع {count} قصة.'],
        'bases.importFailed': ['Could not import that file.', 'تعذّر استيراد هذا الملف.'],
        'bases.invalidUrl': ['Enter a valid http(s) file URL.', 'أدخل رابط ملف صالحًا (http/https).'],
        'bases.onlineAdded': ['Online base saved.', 'تم حفظ القاعدة المتصلة.'],
        'bases.onlineExists': ['That online base is already saved.', 'هذه القاعدة المتصلة محفوظة بالفعل.'],
        'bases.exportFailed': ['Could not export this base. Open its URL instead.', 'تعذّر تصدير هذه القاعدة. افتح رابطها بدلًا من ذلك.'],
        'bases.exported': ['Exported "{name}".', 'تم تصدير "{name}".'],
        'bases.deleted': ['Base deleted.', 'تم حذف القاعدة.'],
        'bases.storyCount': ['{count} stories', '{count} قصة'],
        'bases.localOnly': ['Local bases are stored on this device.', 'القواعد المحلية محفوظة على هذا الجهاز.'],

        /* My Stories */
        'myStories.title': ['My Stories', 'قصصي'],
        'myStories.add': ['Add stories', 'إضافة قصص'],
        'myStories.eyebrow': ['Your personal library', 'مكتبتك الشخصية'],
        'myStories.statStories': ['Stories', 'القصص'],
        'myStories.statPdf': ['From PDF', 'من PDF'],
        'myStories.statWords': ['Words', 'الكلمات'],
        'myStories.statTranslations': ['With translations', 'مع ترجمات'],
        'myStories.filters': ['Filters', 'عوامل التصفية'],
        'myStories.sort': ['Sort', 'الترتيب'],
        'myStories.advancedFilters': ['Advanced filters', 'عوامل تصفية متقدمة'],
        'myStories.resetAll': ['Reset all', 'إعادة ضبط الكل'],
        'myStories.resetFilters': ['Reset filters', 'إعادة ضبط عوامل التصفية'],
        'myStories.allSources': ['All sources', 'كل المصادر'],
        'myStories.sourcePdf': ['PDF import', 'استيراد PDF'],
        'myStories.sourceJs': ['JavaScript database', 'قاعدة بيانات JavaScript'],
        'myStories.sourceJson': ['JSON file', 'ملف JSON'],
        'myStories.sourceStudio': ['Written in Studio', 'مكتوبة في الاستوديو'],
        'myStories.sourceText': ['Pasted text', 'نص ملصق'],
        'myStories.sourceOther': ['Other / older stories', 'أخرى / قصص أقدم'],
        'myStories.allLevels': ['All levels', 'كل المستويات'],
        'myStories.anyCefr': ['Any CEFR', 'أي مستوى CEFR'],
        'myStories.notSet': ['Not set', 'غير محدد'],
        'myStories.anyTag': ['Any tag', 'أي وسم'],
        'myStories.features': ['Features', 'الميزات'],
        'myStories.hasTranslations': ['Has translations', 'لديها ترجمات'],
        'myStories.hasAudio': ['Has audio', 'لديها صوت'],
        'myStories.wordsMin': ['Words (min)', 'الكلمات (الحد الأدنى)'],
        'myStories.wordsMax': ['Words (max)', 'الكلمات (الحد الأقصى)'],
        'myStories.addedFrom': ['Added from', 'أضيفت من'],
        'myStories.addedTo': ['Added to', 'أضيفت إلى'],
        'myStories.loading': ['Loading your stories…', 'جارٍ تحميل قصصك…'],
        'myStories.exportFiltered': ['Export filtered', 'تصدير المصفّى'],
        'myStories.emptyTitle': ['No stories yet', 'لا توجد قصص بعد'],
        'myStories.emptyText': ['Save a story from Stories Studio to see it here.', 'احفظ قصة من استوديو القصص لتظهر هنا.'],
        'myStories.openStudio': ['Open Stories Studio', 'افتح استوديو القصص'],
        'myStories.newest': ['Newest first', 'الأحدث أولًا'],
        'myStories.oldest': ['Oldest first', 'الأقدم أولًا'],
        'myStories.titleAz': ['Title A–Z', 'العنوان أ–ي'],
        'myStories.mostWords': ['Most words', 'الأكثر كلمات'],
        'myStories.fewestWords': ['Fewest words', 'الأقل كلمات'],

        /* Reader */
        'reader.title': ['Reader', 'القارئ'],
        'reader.loading': ['Loading Story...', 'جارٍ تحميل القصة...'],
        'reader.loadingContent': ['Loading story content...', 'جارٍ تحميل محتوى القصة...'],
        'reader.dictionary': ['Dictionary', 'القاموس'],
        'reader.selectWord': ['Select a word in the story to see its translation.', 'اختر كلمة في القصة لترى ترجمتها.'],
        'reader.saveWord': ['Save Word', 'حفظ الكلمة'],
        'reader.alreadySaved': ['Already Saved', 'محفوظة بالفعل'],
        'reader.saveNoTranslation': ['Save Word (No Translation)', 'حفظ الكلمة (دون ترجمة)'],
        'reader.noTranslation': ['No translation available', 'لا توجد ترجمة متاحة'],
        'reader.photoPreview': ['Photo preview', 'معاينة الصورة'],
        'reader.photos': ['Photos', 'الصور'],
        'reader.dictionaryPages': ['Dictionary pages', 'صفحات القاموس'],
        'reader.photoSelectWord': ['Select a word to see photos.', 'اختر كلمة لعرض الصور.'],
        'reader.photoFinding': ['Finding a photo…', 'جارٍ البحث عن صورة…'],
        'reader.photoEmpty': ['No photo found for this word.', 'لا توجد صورة لهذه الكلمة.'],
        'reader.photoOffline': ['Photos need an internet connection.', 'تحتاج الصور إلى اتصال بالإنترنت.'],
        'reader.photoError': ['Photo unavailable right now.', 'الصورة غير متاحة الآن.'],
        'reader.photoPrevious': ['Previous photo', 'الصورة السابقة'],
        'reader.photoNext': ['Next photo', 'الصورة التالية'],
        'reader.photoNumber': ['Photo {number}', 'الصورة {number}'],
        'reader.photoSwipeHint': ['Swipe left to browse photos', 'اسحب لليسار لاستعراض الصور'],
        'reader.lessonVideo': ['Lesson video', 'فيديو الدرس'],
        'reader.watchPlaylist': ['Watch the full playlist', 'شاهد قائمة التشغيل الكاملة'],
        'reader.noDescription': ['No description available for this story.', 'لا يوجد وصف متاح لهذه القصة.'],
        // 'reader.exit': ['Exit', 'خروج'],
        'reader.copyStory': ['Copy Story', 'نسخ القصة'],
        'reader.printStory': ['Print Story', 'طباعة القصة'],
        'reader.downloadStory': ['Download Story', 'تنزيل القصة'],
        'reader.listen': ['Listen', 'استمع'],
        'reader.customTranslations': ['Custom Translations Available', 'ترجمات مخصصة متاحة'],
        'reader.translating': ['Translating...', 'جارٍ الترجمة...'],
        'reader.failedInit': ['Failed to initialize application', 'تعذّر تهيئة التطبيق'],
        'reader.storyNotFound': ['Story not found in any database. Showing fallback.', 'لم يتم العثور على القصة في أي قاعدة بيانات. يتم عرض قصة بديلة.'],
        'reader.failedStory': ['Failed to load story. Using fallback story.', 'تعذّر تحميل القصة. يتم استخدام قصة بديلة.'],
        'reader.theme': ['Theme', 'المظهر'],
        'reader.lightDark': ['Light or Dark mode', 'الوضع الفاتح أو الداكن'],
        'reader.fontSize': ['Font Size', 'حجم الخط'],
        'reader.adjustTextSize': ['Adjust text size', 'اضبط حجم النص'],
        'reader.fontFamily': ['font family', 'نوع الخط'],
        'reader.changeFont': ['change the font', 'غيّر الخط'],
        'reader.lineSpacing': ['Line Spacing', 'تباعد الأسطر'],
        'reader.adjustLineSpacing': ['Adjust space between lines', 'اضبط المسافة بين الأسطر'],
        'reader.toggleLineSpacing': ['Toggle line spacing', 'تبديل تباعد الأسطر'],
        'reader.spacing': ['Spacing', 'التباعد'],
        'reader.autoTranslate': ['Auto-translate Words', 'ترجمة الكلمات تلقائيًا'],
        'reader.autoTranslateDesc': ['Automatically translate words when dictionary opens. Need Internet', 'ترجمة الكلمات تلقائيًا عند فتح القاموس. تحتاج إلى إنترنت'],
        'reader.speakWord': ['Speak this word', 'انطق هذه الكلمة'],
        'reader.usingLanguage': ['Using {language} ({code})', 'باستخدام {language} ({code})'],
        'reader.custom': ['Custom', 'مخصص'],
        'reader.downloadedAs': ['Story downloaded as {filename}', 'تم تنزيل القصة باسم {filename}'],
        'reader.noStoryDownload': ['No story loaded to download', 'لا توجد قصة محمّلة لتنزيلها'],
        'reader.downloadError': ['Error downloading story: ', 'حدث خطأ أثناء تنزيل القصة: '],

        /* Settings */
        'settings.title': ['Settings', 'الإعدادات'],
        'settings.eyebrow': ['One place for every page', 'مكان واحد لكل الصفحات'],
        'settings.heroText': ['Theme, colours, reading, features and custom CSS — saved once and used across the whole app. Each page keeps its own settings panel too; changes here apply everywhere.', 'المظهر والألوان والقراءة والميزات وCSS المخصص — تُحفظ مرة واحدة وتُستخدم في التطبيق كله. كل صفحة تحتفظ بلوحة إعداداتها أيضًا؛ التغييرات هنا تُطبّق في كل مكان.'],
        'settings.appearance': ['Appearance', 'المظهر'],
        'settings.theme': ['Theme', 'المظهر'],
        'settings.themeDesc': ['Light or dark mode', 'الوضع الفاتح أو الداكن'],
        'settings.accent': ['Accent color', 'لون التمييز'],
        'settings.accentDesc': ['Primary colour used for buttons and highlights', 'اللون الأساسي المستخدم للأزرار والإبرازات'],
        'settings.secondary': ['Secondary color', 'اللون الثانوي'],
        'settings.secondaryDesc': ['Used for accents, badges and gradients', 'يُستخدم للتمييز والشارات والتدرجات'],
        'settings.reading': ['Reading', 'القراءة'],
        'settings.fontFamily': ['Font family', 'نوع الخط'],
        'settings.fontFamilyDesc': ['Reading font used in the story reader', 'خط القراءة المستخدم في قارئ القصص'],
        'settings.fontSize': ['Font size', 'حجم الخط'],
        'settings.fontSizeDesc': ['Text size in the story reader (1.0–2.0 rem)', 'حجم النص في قارئ القصص (1.0–2.0 rem)'],
        'settings.lineSpacing': ['Line spacing', 'تباعد الأسطر'],
        'settings.lineSpacingDesc': ['Comfortable or relaxed spacing between lines', 'تباعد مريح أو واسع بين الأسطر'],
        'settings.normal': ['Normal', 'عادي'],
        'settings.relaxed': ['Relaxed', 'واسع'],
        'settings.translation': ['Translation', 'الترجمة'],
        'settings.defaultLanguage': ['Default translation language', 'لغة الترجمة الافتراضية'],
        'settings.defaultLanguageDesc': ['Language used when translating a tapped word', 'اللغة المستخدمة عند ترجمة كلمة منقورة'],
        'settings.autoTranslate': ['Auto-translate on tap', 'الترجمة التلقائية عند النقر'],
        'settings.autoTranslateDesc': ['Show the translation immediately when a word is tapped', 'إظهار الترجمة فورًا عند النقر على كلمة'],
        'settings.paragraphTranslation': ['Paragraph translation', 'ترجمة الفقرة'],
        'settings.paragraphTranslationDesc': ['Translate a whole paragraph, not just single words', 'ترجمة الفقرة كاملة وليس الكلمات المفردة فقط'],
        'settings.hideTranslated': ['Hide translated words', 'إخفاء الكلمات المترجمة'],
        'settings.hideTranslatedDesc': ['Hide words that already have a saved translation', 'إخفاء الكلمات التي لديها ترجمة محفوظة'],
        'settings.libraryQuizzes': ['Library & Quizzes', 'المكتبة والاختبارات'],
        'settings.showQuizzes': ['Show my quizzes', 'إظهار اختباراتي'],
        'settings.showQuizzesDesc': ['Display the quizzes you created in the quiz page', 'عرض الاختبارات التي أنشأتها في صفحة الاختبار'],
        'settings.vocabularySpeech': ['Vocabulary & Speech', 'المفردات والنطق'],
        'settings.pronunciationButtons': ['Pronunciation buttons', 'أزرار النطق'],
        'settings.pronunciationButtonsDesc': ['Show the speaker button next to saved words', 'إظهار زر السماعة بجانب الكلمات المحفوظة'],
        'settings.autoPronounce': ['Auto-pronounce flashcards', 'النطق التلقائي للبطاقات'],
        'settings.autoPronounceDesc': ['Read a flashcard aloud when it appears', 'قراءة البطاقة بصوت مسموع عند ظهورها'],
        'settings.customCss': ['Custom CSS', 'CSS مخصص'],
        'settings.customCssPlaceholder': ['Write your custom CSS here...', 'اكتب CSS المخصص هنا...'],
        'settings.save': ['Save', 'حفظ'],
        'settings.preview': ['Preview', 'معاينة'],
        'settings.clear': ['Clear', 'مسح'],
        'settings.dataManagement': ['Data Management', 'إدارة البيانات'],
        'settings.exportStories': ['Export my stories', 'تصدير قصصي'],
        'settings.exportStoriesDesc': ['Download the stories you created (with their translations) as a JSON file', 'نزّل القصص التي أنشأتها (مع ترجماتها) كملف JSON'],
        'settings.exportStoriesBtn': ['Export stories', 'تصدير القصص'],
        'settings.deleteStories': ['Delete my stories', 'حذف قصصي'],
        'settings.deleteStoriesDesc': ['Permanently delete all stories you uploaded. This cannot be undone', 'حذف كل القصص التي حمّلتها نهائيًا. لا يمكن التراجع عن ذلك'],
        'settings.deleteStoriesBtn': ['Delete stories', 'حذف القصص'],
        'settings.backup': ['Backup all data', 'نسخ كل البيانات احتياطيًا'],
        'settings.backupDesc': ['Download a backup of everything saved on this device', 'نزّل نسخة احتياطية من كل ما هو محفوظ على هذا الجهاز'],
        'settings.backupBtn': ['Backup data', 'نسخ البيانات'],
        'settings.restore': ['Restore data', 'استعادة البيانات'],
        'settings.restoreDesc': ['Import a previously saved backup file, replacing what is on this device', 'استيراد ملف نسخة احتياطية محفوظ سابقًا، مع استبدال ما هو على هذا الجهاز'],
        'settings.restoreBtn': ['Restore data', 'استعادة البيانات'],
        'settings.deleteAll': ['Delete all data', 'حذف كل البيانات'],
        'settings.deleteAllDesc': ['Remove everything saved on this device — stories, words, quizzes and settings', 'إزالة كل ما هو محفوظ على هذا الجهاز — القصص والكلمات والاختبارات والإعدادات'],
        'settings.deleteAllBtn': ['Delete everything', 'حذف كل شيء'],
        'settings.aboutReset': ['About & reset', 'حول وإعادة الضبط'],
        'settings.profile': ['Profile', 'الملف الشخصي'],
        'settings.profileDesc': ['Change the name and photo shown next to your stories', 'غيّر الاسم والصورة الظاهرين بجانب قصصك'],
        'settings.openProfile': ['Open profile', 'فتح الملف الشخصي'],
        'settings.version': ['Version', 'الإصدار'],
        'settings.versionText': ['IStories 2.1.0 · by Ammar chacal', 'IStories 2.1.0 · بواسطة عمار شقل'],
        'settings.refresh': ['Refresh', 'تحديث'],
        'settings.resetPreferences': ['Reset preferences', 'إعادة ضبط التفضيلات'],
        'settings.resetPreferencesDesc': ['Restore theme, colours, reading and feature settings to their defaults. Your stories, words and quizzes are kept.', 'أعد المظهر والألوان والقراءة وإعدادات الميزات إلى افتراضياتها. تبقى قصصك وكلماتك واختباراتك محفوظة.'],
        'settings.language': ['Interface language', 'لغة الواجهة'],
        'settings.languageDesc': ['Choose the language used for menus, buttons and pages', 'اختر اللغة المستخدمة في القوائم والأزرار والصفحات'],
        'settings.english': ['English', 'الإنجليزية'],
        'settings.arabic': ['Arabic', 'العربية'],
        'settings.helpDesc': ['Open the full guide to learn every page and feature', 'افتح الدليل الكامل لتتعرف على كل صفحة وميزة'],
        'settings.openGuide': ['Open guide', 'افتح الدليل'],

        /* Studio import cards */
        'studio.sourceIntro': ['Open a <code>.js</code> or <code>.json</code> database such as <code>database/database/main.js</code>, then read or save any story it contains.', 'افتح قاعدة بيانات <code>.js</code> أو <code>.json</code> مثل <code>database/database/main.js</code>، ثم اقرأ أو احفظ أي قصة تحتويها.'],
        'studio.pdfIntro': ['Choose up to <strong>10 pages</strong> from a PDF, extract their text, edit it, and save it as a story.', 'اختر حتى <strong>10 صفحات</strong> من ملف PDF، واستخرج نصها، وحرّره، ثم احفظه كقصة.'],
        'studio.codeNote': ['Everything after <code>//</code> is a note listing every value the field accepts (the hashtags). The <strong>Copy</strong> button removes the notes for you.', 'كل ما يأتي بعد <code>//</code> هو ملاحظة تسرد كل قيمة يقبلها الحقل (الوسوم). زر <strong>نسخ</strong> يزيل الملاحظات نيابةً عنك.'],
        'studio.langHint': ['{name} · {direction} · read with a {name} voice', '{name} · {direction} · يُقرأ بصوت {name}'],
        'studio.direction.ltr': ['left-to-right', 'من اليسار إلى اليمين'],
        'studio.direction.rtl': ['right-to-left', 'من اليمين إلى اليسار'],

        /* Tools */
        'tools.eyebrow': ['Toolkit', 'صندوق الأدوات'],
        'tools.title': ['IStories Tools', 'أدوات IStories'],
        'tools.text': ['Small utilities that help you build and study your own material — convert word lists, analyse any text, and jump straight into the rest of the app.', 'أدوات صغيرة تساعدك على بناء موادك ودراستها — حوّل قوائم الكلمات، وحلّل أي نص، وانتقل مباشرة إلى بقية التطبيق.'],
        'tools.jumpBackIn': ['Jump back in', 'تابع من حيث توقفت'],

        /* Quiz */
        'quiz.footerBrand': ['IStories Quizzes', 'اختبارات IStories'],

        /* Help & Guide page */
        'help.titleTag': ['Help & Guide — IStories', 'المساعدة والدليل — IStories'],
        'help.eyebrow': ['Help & Guide', 'المساعدة والدليل'],
        'help.title': ['Everything IStories can do', 'كل ما يمكنك فعله في IStories'],
        'help.subtitle': ['A complete walkthrough of every page, button and study tool — with screenshots taken from the real app. Browse the sections below, or start with the video tour.', 'جولة كاملة في كل صفحة وزر وأداة دراسية — مع لقطات مأخوذة من التطبيق نفسه. تصفّح الأقسام أدناه، أو ابدأ بالجولة المرئية.'],
        'help.ctaLibrary': ['Continue to Story Library', 'الانتقال إلى مكتبة القصص'],
        'help.ctaTour': ['Watch the video tour', 'شاهد الجولة المرئية'],
        'help.ctaPrint': ['Print / save as PDF', 'طباعة / حفظ بصيغة PDF'],
        'help.badgeSections': ['14 guided sections', '14 قسمًا إرشاديًا'],
        'help.badgeScreens': ['Screenshots from the app', 'لقطات من التطبيق'],
        'help.badgeOffline': ['Works offline', 'يعمل دون اتصال'],
        'help.heroCardKicker': ['Read · listen · remember', 'اقرأ · استمع · تذكّر'],
        'help.heroCardTitle': ['One story at a time', 'قصة واحدة في كل مرة'],
        'help.heroCardStat': ['features covered', 'ميزة مشروحة'],
        'help.newTitle': ['Welcome — let’s get you started', 'مرحبًا — لنبدأ معًا'],
        'help.newText': ['You were sent here because this browser has no IStories activity yet. Pick a section below, or continue straight to the Story Library.', 'تم إرسالك إلى هنا لأن هذا المتصفح لا يحتوي على نشاط سابق في IStories. اختر قسمًا أدناه، أو انتقل مباشرة إلى مكتبة القصص.'],
        'help.newCta': ['Start reading', 'ابدأ القراءة'],
        'help.newDismiss': ['Got it', 'فهمت'],
        'help.tocTitle': ['Find what you need', 'اعثر على ما تحتاجه'],
        'help.tocHint': ['Jump straight to any page or feature.', 'انتقل مباشرة إلى أي صفحة أو ميزة.'],
        'help.toc.start': ['Start here', 'ابدأ من هنا'],
        'help.toc.library': ['Story Library', 'مكتبة القصص'],
        'help.toc.reader': ['Reading', 'القراءة'],
        'help.toc.bases': ['Story Bases', 'قواعد القصص'],
        'help.toc.myStories': ['My Stories', 'قصصي'],
        'help.toc.studio': ['Stories Studio', 'استوديو القصص'],
        'help.toc.vocabulary': ['Vocabulary', 'المفردات'],
        'help.toc.flashcards': ['Flashcards', 'البطاقات التعليمية'],
        'help.toc.quiz': ['Quiz', 'الاختبار'],
        'help.toc.profile': ['Profile', 'الملف الشخصي'],
        'help.toc.store': ['Story Store', 'متجر القصص'],
        'help.toc.tools': ['Tools', 'الأدوات'],
        'help.toc.settings': ['Settings', 'الإعدادات'],
        'help.toc.offline': ['Offline & help', 'دون اتصال والمساعدة'],
        'help.videoEyebrow': ['Video tour', 'جولة مرئية'],
        'help.videoTitle': ['A quick tour of IStories', 'جولة سريعة في IStories'],
        'help.videoText': ['See how the library, reader, translator and study tools fit together in under a minute.', 'شاهد كيف تتكامل المكتبة والقارئ والترجمة وأدوات الدراسة في أقل من دقيقة.'],
        'help.videoNote': ['Silent tour with captions. The video is cached after the first view.', 'جولة صامتة مع ترجمة نصية. تُحفظ النسخة مؤقتًا بعد المشاهدة الأولى.'],
        'help.videoUnsupported': ['Your browser cannot play this video. You can still explore every feature using the sections below.', 'متصفحك لا يستطيع تشغيل هذا الفيديو. يمكنك استكشاف كل ميزة عبر الأقسام أدناه.'],
        'help.transcriptSummary': ['Read the transcript', 'اقرأ النص'],
        'help.videoCue1': ['Browse the Story Library and open a story.', 'تصفّح مكتبة القصص وافتح قصة.'],
        'help.videoCue2': ['Tap any word to see its translation and save it.', 'انقر على أي كلمة لرؤية ترجمتها وحفظها.'],
        'help.videoCue3': ['Review saved words in Vocabulary.', 'راجع الكلمات المحفوظة في المفردات.'],
        'help.videoCue4': ['Practise with Flashcards and quizzes.', 'تدرّب باستخدام البطاقات والاختبارات.'],
        'help.videoCue5': ['Create your own story in Stories Studio.', 'أنشئ قصتك في استوديو القصص.'],
        'help.videoCue6': ['Tune everything in Settings.', 'اضبط كل شيء من الإعدادات.'],
        'help.steps': ['How to use it', 'كيفية الاستخدام'],
        'help.tip': ['Tip', 'نصيحة'],
        'help.backTop': ['Back to top', 'العودة إلى الأعلى'],
        'help.footerEyebrow': ['Ready to read?', 'مستعد للقراءة؟'],
        'help.footerTitle': ['Your next story is waiting', 'قصتك التالية بانتظارك'],
        'help.footerText': ['Go back to the library, pick a story, and try tapping a word. That is all it takes to start learning.', 'عُد إلى المكتبة، واختر قصة، وجرّب النقر على كلمة. هذا كل ما تحتاجه لبدء التعلم.'],
        'help.openHome': ['Open the home page', 'افتح الصفحة الرئيسية'],
        'help.openLibrary': ['Open the Story Library', 'افتح مكتبة القصص'],
        'help.openReader': ['Open the reader', 'افتح القارئ'],
        'help.openBases': ['Open Story Bases', 'افتح قواعد القصص'],
        'help.openMyStories': ['Open My Stories', 'افتح قصصي'],
        'help.openStudio': ['Open Stories Studio', 'افتح استوديو القصص'],
        'help.openVocabulary': ['Open Vocabulary', 'افتح المفردات'],
        'help.openFlashcards': ['Open Flashcards', 'افتح البطاقات'],
        'help.openQuiz': ['Open Quiz', 'افتح الاختبار'],
        'help.openProfile': ['Open Profile', 'افتح الملف الشخصي'],
        'help.openStore': ['Open Story Store', 'افتح متجر القصص'],
        'help.openTools': ['Open Tools', 'افتح الأدوات'],
        'help.openSettings': ['Open Settings', 'افتح الإعدادات'],

        /* Help & Guide — Start here */
        'help.start.title': ['Start here: navigation, language & theme', 'ابدأ من هنا: التنقل واللغة والمظهر'],
        'help.start.summary': ['The sidebar is your map to the whole app. Open it with the ☰ button on any page, switch language whenever you like, and make the interface comfortable for your eyes.', 'الشريط الجانبي هو خريطتك إلى التطبيق كله. افتحه بزر ☰ في أي صفحة، وبدّل اللغة وقتما تشاء، واجعل الواجهة مريحة لعينيك.'],
        'help.start.caption': ['The IStories landing page. Choose “Start learning” to open the Story Library.', 'صفحة IStories الرئيسية. اختر «ابدأ التعلم» لفتح مكتبة القصص.'],
        'help.start.step1': ['Open the menu with the ☰ button. On a computer the sidebar stays open; on a phone it slides in from the side.', 'افتح القائمة بزر ☰. على الكمبيوتر يبقى الشريط الجانبي مفتوحًا، وعلى الهاتف ينزلق من الجانب.'],
        'help.start.step2': ['Use the language buttons at the bottom of the menu to switch between English and Arabic. The whole layout flips to right-to-left.', 'استخدم أزرار اللغة أسفل القائمة للتبديل بين الإنجليزية والعربية. ينقلب التخطيط كله إلى الاتجاه من اليمين إلى اليسار.'],
        'help.start.step3': ['Tap Theme to switch between light and dark mode. Your choice is remembered the next time you visit.', 'اضغط على المظهر للتبديل بين الوضع الفاتح والداكن. يُحفظ اختيارك في زيارتك التالية.'],
        'help.start.step4': ['For an app-like experience, open your browser menu and choose “Install app” or “Add to home screen”. IStories then opens in its own window and works offline.', 'لتجربة تشبه التطبيقات، افتح قائمة المتصفح واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». يفتح IStories بعدها في نافذة مستقلة ويعمل دون اتصال.'],
        'help.start.tip': ['The accent colour and reading font can be changed in Settings. They apply to every page automatically.', 'يمكن تغيير لون التمييز وخط القراءة من الإعدادات، ويُطبّقان على كل صفحة تلقائيًا.'],
        'help.start.mobileCaption': ['On a phone the menu opens as a drawer.', 'على الهاتف تُفتح القائمة كدرج جانبي.'],

        /* Help & Guide — Story Library */
        'help.library.title': ['Browse and open stories', 'تصفّح القصص وافتحها'],
        'help.library.summary': ['The Story Library is the front door to the built-in story databases. Filter by level and language, search for a title, or let IStories pick a random story for you.', 'مكتبة القصص هي المدخل إلى قواعد القصص المدمجة. رشّح حسب المستوى واللغة، أو ابحث عن عنوان، أو دع IStories يختار لك قصة عشوائية.'],
        'help.library.caption': ['Your progress, quick actions and story cards in one place.', 'تقدمك وإجراءاتك السريعة وبطاقات القصص في مكان واحد.'],
        'help.library.step1': ['Use the level and language menus above the cards to narrow the list. “All” shows every available story.', 'استخدم قائمتي المستوى واللغة فوق البطاقات لتضييق القائمة. يعرض «الكل» كل القصص المتاحة.'],
        'help.library.step2': ['Type in the search box to find a title, author or phrase. Press Enter or the arrow button to search.', 'اكتب في مربع البحث للعثور على عنوان أو مؤلف أو عبارة. اضغط Enter أو زر السهم للبحث.'],
        'help.library.step3': ['Tap a story card to open it in the reader. Your last story is remembered, so you can continue where you left off.', 'اضغط على بطاقة قصة لفتحها في القارئ. تُحفظ آخر قصة، لذا يمكنك المتابعة من حيث توقفت.'],
        'help.library.step4': ['Use Random Story for a surprise, Recent Stories to resume something you already opened, or the base menu to switch story collections.', 'استخدم «قصة عشوائية» لمفاجأة، و«القصص الأخيرة» لاستئناف قصة فتحتها، أو قائمة القواعد لتبديل مجموعات القصص.'],
        'help.library.tip': ['The number above each story is an estimate of reading time. Choose a short story when you only have a few minutes.', 'الرقم فوق كل قصة تقدير لوقت القراءة. اختر قصة قصيرة عندما يكون لديك بضع دقائق فقط.'],

        /* Help & Guide — Reader */
        'help.reader.title': ['Read, listen and translate as you go', 'اقرأ واستمع وترجم أثناء التقدم'],
        'help.reader.summary': ['The reader is the heart of IStories. Tap any word for an instant translation, listen to the narration, and save new vocabulary without leaving the story.', 'القارئ هو قلب IStories. انقر على أي كلمة لترجمة فورية، واستمع إلى السرد، واحفظ مفردات جديدة دون مغادرة القصة.'],
        'help.reader.caption': ['Tap a word to open the dictionary panel and hear its pronunciation.', 'انقر على كلمة لفتح لوحة القاموس وسماع نطقها.'],
        'help.reader.step1': ['Tap or click any highlighted word. Its translation and definition appear in the dictionary panel on the right (or below the story on a phone).', 'انقر على أي كلمة مميزة. تظهر ترجمتها وتعريفها في لوحة القاموس على اليمين (أو أسفل القصة على الهاتف).'],
        'help.reader.step2': ['Press the speaker button to hear the word, or use the narration player under the title to listen to the whole story.', 'اضغط زر مكبر الصوت لسماع الكلمة، أو استخدم مشغل السرد أسفل العنوان لسماع القصة كاملة.'],
        'help.reader.step3': ['Press Save Word to add it to Vocabulary. You can review it later in Flashcards and quizzes.', 'اضغط «حفظ الكلمة» لإضافتها إلى المفردات. يمكنك مراجعتها لاحقًا في البطاقات والاختبارات.'],
        'help.reader.step4': ['Open the reader settings gear to change font size, font family, line spacing, translation language, paragraph translation and text-to-speech.', 'افتح إعدادات القارئ لتغيير حجم الخط ونوعه وتباعد الأسطر ولغة الترجمة وترجمة الفقرات والقراءة الصوتية.'],
        'help.reader.tip': ['Use the Description tab for the author’s notes and any video. The toolbar also lets you copy, print or download the story.', 'استخدم تبويب الوصف لملاحظات المؤلف وأي فيديو. يتيح لك شريط الأدوات أيضًا نسخ القصة أو طباعتها أو تنزيلها.'],

        /* Help & Guide — Story Bases */
        'help.bases.title': ['Manage your story collections', 'أدر مجموعات قصصك'],
        'help.bases.summary': ['Story Bases controls what feeds the Story Library: the built-in collections, JavaScript files you import from your device, and online database links you want to keep.', 'تتحكم قواعد القصص في ما يغذي مكتبة القصص: المجموعات المدمجة، وملفات JavaScript التي تستوردها من جهازك، وروابط قواعد البيانات عبر الإنترنت التي تريد الاحتفاظ بها.'],
        'help.bases.caption': ['Built-in, local and online bases live side by side.', 'القواعد المدمجة والمحلية وعبر الإنترنت جنبًا إلى جنب.'],
        'help.bases.step1': ['To import a base, choose a .js story database from your device, give it an optional name and press Add local base. The file is stored in this browser, so it keeps working offline.', 'لاستيراد قاعدة، اختر قاعدة قصص بصيغة .js من جهازك، وأدخل اسمًا اختياريًا، ثم اضغط «إضافة قاعدة محلية». يُحفظ الملف في هذا المتصفح، لذا يستمر في العمل دون اتصال.'],
        'help.bases.step2': ['To add an online base, paste its URL and press Add online base. It appears in the library’s base menu after it loads.', 'لإضافة قاعدة عبر الإنترنت، الصق رابطها واضغط «إضافة قاعدة عبر الإنترنت». تظهر في قائمة القواعد بالمكتبة بعد تحميلها.'],
        'help.bases.step3': ['Press Open in library on any base to read its stories, or Export to save a copy as a .js file.', 'اضغط «فتح في المكتبة» على أي قاعدة لقراءة قصصها، أو «تصدير» لحفظ نسخة بصيغة .js.'],
        'help.bases.step4': ['Use the delete button on a custom base to remove it. Built-in bases cannot be deleted.', 'استخدم زر الحذف في قاعدة مخصصة لإزالتها. لا يمكن حذف القواعد المدمجة.'],
        'help.bases.tip': ['A local base exists only on this device. Export it if you want to move it to another browser or share it with a friend.', 'القاعدة المحلية موجودة على هذا الجهاز فقط. صدّرها إذا أردت نقلها إلى متصفح آخر أو مشاركتها مع صديق.'],

        /* Help & Guide — My Stories */
        'help.myStories.title': ['Your own library', 'مكتبتك الخاصة'],
        'help.myStories.summary': ['Every story you create or import is kept in My Stories, separate from the built-in library. Search it, filter it, read it, export it, or send it back to Stories Studio for editing.', 'كل قصة تنشئها أو تستوردها تُحفظ في «قصصي» منفصلة عن المكتبة المدمجة. ابحث فيها ورشّحها واقرأها وصدّرها، أو أعدها إلى استوديو القصص للتعديل.'],
        'help.myStories.caption': ['Your saved stories, with their source, level and language labels.', 'قصصك المحفوظة مع وسوم المصدر والمستوى واللغة.'],
        'help.myStories.step1': ['Use the search box for titles, authors, tags or story text. The Filters button opens advanced filters for source, language, level, CEFR, tags, translations, audio, word count and date.', 'استخدم مربع البحث للعناوين أو المؤلفين أو الوسوم أو نص القصة. يفتح زر «عوامل التصفية» خيارات متقدمة للمصدر واللغة والمستوى وCEFR والوسوم والترجمات والصوت وعدد الكلمات والتاريخ.'],
        'help.myStories.step2': ['Press Read to open a story in the reader, Edit to change it in Stories Studio, or the export button to download it as JSON.', 'اضغط «قراءة» لفتح القصة في القارئ، أو «تعديل» لتغييرها في استوديو القصص، أو زر التصدير لتنزيلها بصيغة JSON.'],
        'help.myStories.step3': ['The delete button removes a story from this browser only. Export first if you want to keep a copy.', 'يزيل زر الحذف القصة من هذا المتصفح فقط. صدّرها أولًا إذا أردت الاحتفاظ بنسخة.'],
        'help.myStories.step4': ['The counters at the top show how many stories you have, how many came from PDFs, total words and stories with custom translations.', 'تعرض العدادات في الأعلى عدد قصصك، وعدد القصص من PDF، وإجمالي الكلمات، والقصص ذات الترجمات المخصصة.'],
        'help.myStories.tip': ['Your stories never appear in the built-in Story Library. This keeps your personal library tidy and separate.', 'لا تظهر قصصك أبدًا في مكتبة القصص المدمجة. هذا يحافظ على مكتبتك الشخصية منظمة ومنفصلة.'],

        /* Help & Guide — Stories Studio */
        'help.studio.title': ['Create and import your own stories', 'أنشئ قصصك واستوردها'],
        'help.studio.summary': ['Stories Studio turns a PDF, a JSON file or a plain idea into an interactive story with translations, audio and a cover. No coding is required for the quick-add form.', 'يحوّل استوديو القصص ملف PDF أو JSON أو فكرة بسيطة إلى قصة تفاعلية مع ترجمات وصوت وغلاف. لا يلزم البرمجة لاستخدام نموذج الإضافة السريعة.'],
        'help.studio.caption': ['Upload a story file, import from a database or PDF, or use the quick-add form.', 'ارفع ملف قصة، أو استورد من قاعدة بيانات أو PDF، أو استخدم نموذج الإضافة السريعة.'],
        'help.studio.step1': ['Drop a .json story file on the upload area, or press Browse Files. The expected format is shown in the JSON example lower on the page.', 'أفلت ملف قصة .json في منطقة الرفع، أو اضغط «تصفح الملفات». يظهر التنسيق المطلوب في مثال JSON أسفل الصفحة.'],
        'help.studio.step2': ['Open the import panel to read a built-in database, open a database URL or file, or import a PDF. For PDFs, choose up to 10 pages, edit the extracted text, then save it as a story.', 'افتح لوحة الاستيراد لقراءة قاعدة مدمجة، أو فتح رابط أو ملف قاعدة بيانات، أو استيراد PDF. لملفات PDF، اختر حتى 10 صفحات، وعدّل النص المستخرج، ثم احفظه كقصة.'],
        'help.studio.step3': ['Use the Quick Add Form to type a story by hand. Add a title, level, language, cover, content, optional audio and custom translations.', 'استخدم نموذج الإضافة السريعة لكتابة قصة يدويًا. أضف عنوانًا ومستوى ولغة وغلافًا ومحتوى وصوتًا اختياريًا وترجمات مخصصة.'],
        'help.studio.step4': ['Your stories appear under Your Uploaded Stories. Read, share, edit or delete them there, or export everything as a backup.', 'تظهر قصصك تحت «قصصك المرفوعة». اقرأها أو شاركها أو عدّلها أو احذفها من هناك، أو صدّر كل شيء كنسخة احتياطية.'],
        'help.studio.tip': ['Each line in the Story Content box becomes a separate paragraph. Keep paragraphs short so they are easy to read on a phone.', 'كل سطر في مربع محتوى القصة يصبح فقرة منفصلة. اجعل الفقرات قصيرة لتسهيل قراءتها على الهاتف.'],

        /* Help & Guide — Vocabulary */
        'help.vocabulary.title': ['Build your personal word list', 'ابنِ قائمة كلماتك الشخصية'],
        'help.vocabulary.summary': ['Every word you save while reading lands here. Search it, filter it by language, listen to pronunciation, and export it when you want to study elsewhere.', 'كل كلمة تحفظها أثناء القراءة تصل إلى هنا. ابحث فيها، ورشّحها حسب اللغة، واستمع إلى النطق، وصدّرها عندما تريد الدراسة في مكان آخر.'],
        'help.vocabulary.caption': ['Saved words with their story, translation and practice status.', 'الكلمات المحفوظة مع قصتها وترجمتها وحالة التدريب.'],
        'help.vocabulary.step1': ['Search for a word or translation, or open the language menu to study one language at a time.', 'ابحث عن كلمة أو ترجمة، أو افتح قائمة اللغة لدراسة لغة واحدة في كل مرة.'],
        'help.vocabulary.step2': ['Press the speaker button to hear a word. The cards show where you found it and when it was added.', 'اضغط زر مكبر الصوت لسماع الكلمة. تعرض البطاقات أين وجدتها ومتى أُضيفت.'],
        'help.vocabulary.step3': ['Use Export CSV to download your list, or Import to merge a CSV/JSON vocabulary file. Remove all clears the list after confirmation.', 'استخدم «تصدير CSV» لتنزيل قائمتك، أو «استيراد» لدمج ملف مفردات CSV/JSON. «إزالة الكل» يمسح القائمة بعد التأكيد.'],
        'help.vocabulary.step4': ['Mastered and Due for Practice update automatically as you review words in Flashcards.', 'يتحدث «المتقن» و«المستحق للتدريب» تلقائيًا أثناء مراجعة الكلمات في البطاقات.'],
        'help.vocabulary.tip': ['Save only the words that matter to you. A short list you actually review beats a long list you never open.', 'احفظ فقط الكلمات المهمة لك. قائمة قصيرة تراجعها فعلًا أفضل من قائمة طويلة لا تفتحها أبدًا.'],

        /* Help & Guide — Flashcards */
        'help.flashcards.title': ['Review words until they stick', 'راجع الكلمات حتى تثبت'],
        'help.flashcards.summary': ['Flashcards turn your saved words into a short daily review. Cards that are due come back automatically, so you spend time on the words you are about to forget.', 'تحوّل البطاقات كلماتك المحفوظة إلى مراجعة يومية قصيرة. تعود البطاقات المستحقة تلقائيًا، فتقضي وقتك مع الكلمات التي توشك على نسيانها.'],
        'help.flashcards.caption': ['Flip the card, then rate how well you remembered it.', 'اقلب البطاقة، ثم قيّم مدى تذكرك لها.'],
        'help.flashcards.step1': ['Open Flashcards from the sidebar. The session starts with the cards that are due today; use the language menu to focus on one language.', 'افتح البطاقات من الشريط الجانبي. تبدأ الجلسة بالبطاقات المستحقة اليوم؛ استخدم قائمة اللغة للتركيز على لغة واحدة.'],
        'help.flashcards.step2': ['Read the word, try to remember the meaning, then tap the card to flip it.', 'اقرأ الكلمة، وحاول تذكر المعنى، ثم اضغط على البطاقة لقلبها.'],
        'help.flashcards.step3': ['Rate your answer with Again, Hard, Good or Easy. The next review date is scheduled from your rating.', 'قيّم إجابتك بـ «مرة أخرى» أو «صعب» أو «جيد» أو «سهل». يُجدول موعد المراجعة التالي بناءً على تقييمك.'],
        'help.flashcards.step4': ['Use Shuffle for a mixed session or Reset Progress to start the schedule again. The top cards show due, total, mastered and learning counts.', 'استخدم «خلط» لجلسة متنوعة أو «إعادة ضبط التقدم» لبدء الجدول من جديد. تعرض البطاقات العلوية أعداد المستحق والإجمالي والمتقن والمتعلم.'],
        'help.flashcards.tip': ['A two-minute session every day is more effective than a long session once a week. The streak counter rewards consistency.', 'جلسة دقيقتين كل يوم أكثر فاعلية من جلسة طويلة مرة في الأسبوع. يكافئ عداد السلسلة الانتظام.'],

        /* Help & Guide — Quiz */
        'help.quiz.title': ['Check what you have learned', 'تحقق مما تعلمته'],
        'help.quiz.summary': ['Take a built-in quiz or upload your own. Filter by level, preview the questions, and see your last attempt so you know what to review next.', 'خُذ اختبارًا مدمجًا أو ارفع اختبارك. رشّح حسب المستوى، وعاين الأسئلة، واطّلع على محاولتك الأخيرة لتعرف ما تراجعه تاليًا.'],
        'help.quiz.caption': ['Choose a quiz collection, then start, preview or review your last attempt.', 'اختر مجموعة اختبارات، ثم ابدأ أو عاين أو راجع محاولتك الأخيرة.'],
        'help.quiz.step1': ['Use the collection menu to show all levels, one level, or only the quizzes you created with User.', 'استخدم قائمة المجموعات لعرض كل المستويات أو مستوى واحد أو اختباراتك التي أنشأتها فقط عبر «المستخدم».'],
        'help.quiz.step2': ['Press Start Quiz to begin or Preview to read the questions first. Your last score and attempt date appear on each card.', 'اضغط «بدء الاختبار» للبدء أو «معاينة» لقراءة الأسئلة أولًا. تظهر درجتك الأخيرة وتاريخ المحاولة على كل بطاقة.'],
        'help.quiz.step3': ['To add a quiz, drop a JSON file in Upload Your Own Quiz, or download the template and edit it. Created quizzes can be exported and edited.', 'لإضافة اختبار، أفلت ملف JSON في «ارفع اختبارك»، أو نزّل القالب وعدّله. يمكن تصدير الاختبارات المنشأة وتعديلها.'],
        'help.quiz.step4': ['The quiz feedback explains each answer, so read the explanation even when you get it right.', 'يشرح تقييم الاختبار كل إجابة، لذا اقرأ الشرح حتى عندما تكون إجابتك صحيحة.'],
        'help.quiz.tip': ['The User filter shows only quizzes stored in this browser. Turn “Show my quizzes” off in Settings if you share the device.', 'يعرض مرشح «المستخدم» الاختبارات المخزنة في هذا المتصفح فقط. أوقف «إظهار اختباراتي» من الإعدادات إذا كنت تشارك الجهاز.'],

        /* Help & Guide — Profile */
        'help.profile.title': ['Make IStories yours', 'اجعل IStories لك'],
        'help.profile.summary': ['Your profile photo and name appear on the Story Library home page. Update them whenever you like — they stay on this device.', 'تظهر صورة ملفك واسمك في الصفحة الرئيسية لمكتبة القصص. حدّثهما وقتما تشاء — يبقيان على هذا الجهاز.'],
        'help.profile.caption': ['Change your photo, type a name, then press Save Changes.', 'غيّر صورتك، واكتب اسمًا، ثم اضغط «حفظ التغييرات».'],
        'help.profile.step1': ['Press Change or the camera badge to choose a JPG or PNG photo (up to 5 MB). Use “Use default photo” to go back to the original avatar.', 'اضغط «تغيير» أو شارة الكاميرا لاختيار صورة JPG أو PNG (حتى 5 ميغابايت). استخدم «استخدام الصورة الافتراضية» للعودة إلى الصورة الأصلية.'],
        'help.profile.step2': ['Type your name in the Your Name box. The character counter shows how much space you have left.', 'اكتب اسمك في مربع «اسمك». يعرض عداد الأحرف المساحة المتبقية.'],
        'help.profile.step3': ['Press Save Changes. Reset restores the last saved name and photo without saving new edits.', 'اضغط «حفظ التغييرات». «إعادة الضبط» تستعيد آخر اسم وصورة محفوظين دون حفظ التعديلات الجديدة.'],
        'help.profile.tip': ['XP, level, words learned and your reading streak are shown on the Story Library home page. They update automatically as you read.', 'تظهر نقاط الخبرة والمستوى والكلمات المتعلمة وسلسلة القراءة في الصفحة الرئيسية لمكتبة القصص، وتتحدث تلقائيًا أثناء القراءة.'],

        /* Help & Guide — Story Store */
        'help.store.title': ['Find more stories', 'اعثر على المزيد من القصص'],
        'help.store.summary': ['The Story Store is a catalogue of extra stories. Browse by level, read the details, save a story to My Stories, or download it as a file.', 'متجر القصص هو كتالوج لقصص إضافية. تصفّح حسب المستوى، واقرأ التفاصيل، واحفظ القصة في «قصصي»، أو نزّلها كملف.'],
        'help.store.caption': ['Filter the catalogue by level and save the stories you want to keep.', 'رشّح الكتالوج حسب المستوى واحفظ القصص التي تريد الاحتفاظ بها.'],
        'help.store.step1': ['Choose a level at the top of the page to narrow the catalogue. Every card shows the language, word count and estimated reading time.', 'اختر مستوى أعلى الصفحة لتضييق الكتالوج. تعرض كل بطاقة اللغة وعدد الكلمات ووقت القراءة التقديري.'],
        'help.store.step2': ['Press Save Story to add it to My Stories, where you can read it offline later.', 'اضغط «حفظ القصة» لإضافتها إلى «قصصي»، حيث يمكنك قراءتها دون اتصال لاحقًا.'],
        'help.store.step3': ['Press Download to keep the story as a JSON file, or open it in the reader from My Stories.', 'اضغط «تنزيل» للاحتفاظ بالقصة كملف JSON، أو افتحها في القارئ من «قصصي».'],
        'help.store.tip': ['Saved stories count toward your personal library, not the built-in Story Library. This makes them easy to find and back up.', 'تُحتسب القصص المحفوظة ضمن مكتبتك الشخصية، لا مكتبة القصص المدمجة. هذا يسهّل العثور عليها ونسخها احتياطيًا.'],

        /* Help & Guide — Tools */
        'help.tools.title': ['Prepare your own material', 'جهّز موادك الخاصة'],
        'help.tools.summary': ['Two small utilities help you build content for the app: turn a CSV word list into a dictionary file, or analyse a text before turning it into a story.', 'أداتان صغيرتان تساعدانك على بناء محتوى للتطبيق: حوّل قائمة كلمات CSV إلى ملف قاموس، أو حلّل نصًا قبل تحويله إلى قصة.'],
        'help.tools.caption': ['CSV → Dictionary and Text Analyzer, plus shortcuts to the rest of the app.', 'CSV → قاموس ومحلل النصوص، مع اختصارات إلى بقية التطبيق.'],
        'help.tools.step1': ['Open CSV → Dictionary, paste or upload a CSV of words and translations, then download the dictionary file the reader understands.', 'افتح «CSV → قاموس»، والصق أو ارفع ملف CSV للكلمات والترجمات، ثم نزّل ملف القاموس الذي يفهمه القارئ.'],
        'help.tools.step2': ['Open Text Analyzer and paste any text to see word counts, unique words and difficulty insights before you import it.', 'افتح «محلل النصوص» والصق أي نص لرؤية عدد الكلمات والكلمات الفريدة ومؤشرات الصعوبة قبل استيراده.'],
        'help.tools.step3': ['Use the Jump back in cards at the bottom to return to Vocabulary, Flashcards, Quiz, Stories Studio, Story Store or Settings.', 'استخدم بطاقات «العودة السريعة» أسفل الصفحة للعودة إلى المفردات أو البطاقات أو الاختبار أو الاستوديو أو المتجر أو الإعدادات.'],
        'help.tools.tip': ['A dictionary file can be attached to a story in Stories Studio, so difficult words are translated exactly the way you want.', 'يمكن إرفاق ملف قاموس بقصة في استوديو القصص، لتُترجم الكلمات الصعبة بالطريقة التي تريدها تمامًا.'],

        /* Help & Guide — Settings */
        'help.settings.title': ['One place for every preference', 'مكان واحد لكل التفضيلات'],
        'help.settings.summary': ['Settings controls the theme, accent colours, reading font, translation behaviour, feature toggles, custom CSS and data management for the whole app.', 'تتحكم الإعدادات في المظهر وألوان التمييز وخط القراءة وسلوك الترجمة ومفاتيح الميزات وCSS المخصص وإدارة البيانات للتطبيق كله.'],
        'help.settings.caption': ['Changes made here are saved once and used across every page.', 'تُحفظ التغييرات هنا مرة واحدة وتُستخدم في كل صفحة.'],
        'help.settings.step1': ['Use Appearance for light/dark mode and the primary and secondary accent colours. Use Reading for the font, size and line spacing in the reader.', 'استخدم «المظهر» للوضع الفاتح/الداكن وألوان التمييز الأساسية والثانوية. واستخدم «القراءة» للخط والحجم وتباعد الأسطر في القارئ.'],
        'help.settings.step2': ['Translation controls the default translation language, auto-translate, paragraph translation and whether translated words are hidden.', 'تتحكم «الترجمة» في لغة الترجمة الافتراضية والترجمة التلقائية وترجمة الفقرات وإخفاء الكلمات المترجمة.'],
        'help.settings.step3': ['Library & Quizzes, Vocabulary & Speech toggle the features you want to see. Custom CSS lets you restyle each page separately.', 'تبدّل «المكتبة والاختبارات» و«المفردات والنطق» الميزات التي تريد رؤيتها. ويتيح «CSS المخصص» إعادة تنسيق كل صفحة على حدة.'],
        'help.settings.step4': ['Data Management exports your stories, backs up everything, restores a backup, deletes your stories, or deletes all app data. Reset preferences restores defaults without touching your stories or words.', 'تصدّر «إدارة البيانات» قصصك، وتنسخ كل شيء احتياطيًا، وتستعيد نسخة، وتحذف قصصك، أو تحذف كل بيانات التطبيق. «إعادة ضبط التفضيلات» تستعيد الافتراضات دون المساس بقصصك أو كلماتك.'],
        'help.settings.warningTitle': ['Important', 'مهم'],
        'help.settings.tip': ['Back up before clearing your browser data or switching devices. Everything is stored locally in this browser.', 'انسخ احتياطيًا قبل مسح بيانات المتصفح أو تغيير الجهاز. كل شيء مخزن محليًا في هذا المتصفح.'],

        /* Help & Guide — Offline & help */
        'help.offline.title': ['Offline, updates and quick answers', 'دون اتصال والتحديثات وأجوبة سريعة'],
        'help.offline.summary': ['IStories is designed to keep working when the connection drops. Here is what is available offline, how updates behave, and where your data lives.', 'صُمم IStories ليستمر في العمل عند انقطاع الاتصال. إليك ما يتوفر دون اتصال، وكيف تعمل التحديثات، وأين تعيش بياناتك.'],
        'help.offline.offlineTitle': ['Read offline', 'اقرأ دون اتصال'],
        'help.offline.offlineText': ['After the first visit, the app shell and built-in stories are cached. Local bases and your own stories work offline too. Online bases need a connection the first time they are loaded.', 'بعد الزيارة الأولى، تُحفظ واجهة التطبيق والقصص المدمجة مؤقتًا. تعمل القواعد المحلية وقصصك دون اتصال أيضًا. أما القواعد عبر الإنترنت فتحتاج إلى اتصال عند تحميلها أول مرة.'],
        'help.offline.storageTitle': ['Where is my data?', 'أين بياناتي؟'],
        'help.offline.storageText': ['Your stories, saved words, quizzes and profile live in this browser only. Nothing is uploaded to an account or synced between devices.', 'قصصك وكلماتك المحفوظة واختباراتك وملفك موجودة في هذا المتصفح فقط. لا يُرفع شيء إلى حساب ولا يُزامن بين الأجهزة.'],
        'help.offline.updateTitle': ['Updates', 'التحديثات'],
        'help.offline.updateText': ['When a new version is available, the app asks you to reload. Reloading updates the cached files but keeps your stories and settings.', 'عند توفر إصدار جديد، يطلب منك التطبيق إعادة التحميل. تحدّث إعادة التحميل الملفات المخزنة مؤقتًا لكنها تحتفظ بقصصك وإعداداتك.'],
        'help.offline.audioTitle': ['No sound?', 'لا يوجد صوت؟'],
        'help.offline.audioText': ['Check the device volume, the narration player, and the speech toggles in Settings. Some browsers need one tap on the page before audio is allowed.', 'تحقق من حجم صوت الجهاز ومشغل السرد ومفاتيح النطق في الإعدادات. تحتاج بعض المتصفحات إلى نقرة واحدة على الصفحة قبل السماح بالصوت.'],
        'help.offline.faq1q': ['Why did I land on this guide?', 'لماذا وصلت إلى هذا الدليل؟'],
        'help.offline.faq1a': ['This browser had no IStories activity yet, so the app opened the guide first. Press “Continue to Story Library” or “Start reading” to begin. You can return here any time from the Help & guide link in the sidebar.', 'لم يكن لهذا المتصفح أي نشاط سابق في IStories، لذا فتح التطبيق الدليل أولًا. اضغط «الانتقال إلى مكتبة القصص» أو «ابدأ القراءة» للبدء. يمكنك العودة هنا في أي وقت من رابط «المساعدة والدليل» في الشريط الجانبي.'],
        'help.offline.faq2q': ['How do I move my data to another device?', 'كيف أنقل بياناتي إلى جهاز آخر؟'],
        'help.offline.faq2a': ['Open Settings → Data Management → Backup all data on the old device. On the new device, open the same section and restore that backup file.', 'افتح الإعدادات ← إدارة البيانات ← نسخ كل البيانات احتياطيًا على الجهاز القديم. على الجهاز الجديد، افتح القسم نفسه واستعد ملف النسخة الاحتياطية.'],
        'help.offline.faq3q': ['How do I start over?', 'كيف أبدأ من جديد؟'],
        'help.offline.faq3a': ['Settings → Data Management → Delete all data removes your stories, words, quizzes and preferences from this browser. Export a backup first if you might want them back.', 'الإعدادات ← إدارة البيانات ← حذف كل البيانات يزيل قصصك وكلماتك واختباراتك وتفضيلاتك من هذا المتصفح. صدّر نسخة احتياطية أولًا إذا كنت قد تريد استعادتها.'],
        'help.offline.faq4q': ['Can I use IStories on a phone?', 'هل يمكنني استخدام IStories على الهاتف؟'],
        'help.offline.faq4a': ['Yes. The layout adapts to small screens, the sidebar becomes a drawer, and you can install the app to your home screen for a full-screen experience.', 'نعم. يتكيف التخطيط مع الشاشات الصغيرة، ويتحول الشريط الجانبي إلى درج، ويمكنك تثبيت التطبيق على شاشتك الرئيسية لتجربة ملء الشاشة.'],
        'help.offline.helpTitle': ['Still stuck?', 'ما زلت عالقًا؟'],
        'help.offline.helpText': ['Revisit the section for the page you are using, or open Settings to check the language, theme and data options. Every control in the app is described above.', 'أعد زيارة القسم الخاص بالصفحة التي تستخدمها، أو افتح الإعدادات للتحقق من اللغة والمظهر وخيارات البيانات. كل عنصر تحكم في التطبيق مشروح أعلاه.'],

        /* Generic empty/error states */
        'state.loading': ['Loading…', 'جارٍ التحميل…'],
        'state.error': ['Something went wrong', 'حدث خطأ ما'],
        'state.empty': ['Nothing here yet', 'لا يوجد شيء هنا بعد'],
        'state.noResults': ['No results found', 'لم يتم العثور على نتائج'],
        'state.tryAgain': ['Please try again.', 'يرجى المحاولة مرة أخرى.'],

        /* Document titles */
        'page.homeTitle': ['IStories Reader - Interactive Language Learning Stories', 'قارئ IStories - قصص تفاعلية لتعلم اللغات'],
        'page.libraryTitle': ['Story Library — IStories', 'مكتبة القصص — IStories'],
        'page.myStoriesTitle': ['My Stories — IStories', 'قصصي — IStories'],
        'page.studioTitle': ['Stories Studio — IStories', 'استوديو القصص — IStories'],
        'page.settingsTitle': ['Settings — IStories', 'الإعدادات — IStories'],
        'page.profileTitle': ['Profile — IStories', 'الملف الشخصي — IStories'],
        'page.vocabularyTitle': ['Vocabulary — IStories', 'المفردات — IStories'],
        'page.flashcardsTitle': ['Flashcards — IStories', 'البطاقات التعليمية — IStories'],
        'page.quizTitle': ['Quiz — IStories', 'اختبار — IStories'],
        'page.storeTitle': ['Story Store — IStories', 'متجر القصص — IStories'],
        'page.toolsTitle': ['Tools — IStories', 'الأدوات — IStories']
    };

    /* ----------------------------------------------------------------------
       Extra static phrases (already present in the markup)
       ---------------------------------------------------------------------- */
    var STATIC_PHRASES = {
        /* Home */
        'Learn Languages Through': 'تعلّم اللغات من خلال',
        'Interactive Stories': 'قصص تفاعلية',
        'Stories that teach you a language': 'قصص تعلّمك لغة',
        'Start learning': 'ابدأ التعلّم',
        "See what's inside": 'اكتشف ما بالداخل',
        'Audio narration': 'سرد صوتي',
        'Vocabulary & flashcards': 'مفردات وبطاقات تعليمية',
        'See IStories in action': 'شاهد IStories أثناء العمل',
        'A quick look at how IStories turns everyday reading into real language practice — instant translations, audio and vocabulary, all in one place.': 'نظرة سريعة على كيف يحوّل IStories القراءة اليومية إلى تدريب لغوي حقيقي — ترجمات فورية وصوت ومفردات، كل ذلك في مكان واحد.',
        'Instant translations': 'ترجمة فورية',
        'Tap any word in a story to see its meaning in your own language, right where you are reading.': 'انقر على أي كلمة في القصة لترى معناها بلغتك مباشرةً حيث تقرأ.',
        'Listen & repeat': 'استمع وأعد',
        'Every story can be read aloud with built-in speech, so you hear the pronunciation as you go.': 'يمكن قراءة كل قصة بصوت مسموع عبر النطق المدمج، فتسمع اللفظ أثناء التقدم.',
        'Save new words as you read, then review them with flashcards until they really stick.': 'احفظ الكلمات الجديدة أثناء القراءة، ثم راجعها بالبطاقات التعليمية حتى ترسخ.',
        'Create your own interactive stories in any language and level, then share them with everyone.': 'أنشئ قصصك التفاعلية بأي لغة ومستوى، ثم شاركها مع الجميع.',
        'About': 'عن الموقع',
        'By : Ammar chacal': 'بواسطة: عمار شقل',
        'Your browser does not support the video tag.': 'متصفحك لا يدعم وسم الفيديو.',

        /* Library */
        'Story Library': 'مكتبة القصص',
        'Random Story': 'قصة عشوائية',
        'Recent Stories': 'القصص الأخيرة',
        'All': 'الكل',
        'Beginner': 'مبتدئ',
        'Intermediate': 'متوسط',
        'Advanced': 'متقدم',
        'User': 'المستخدم',
        'All languages': 'كل اللغات',
        'Search stories': 'ابحث عن قصص',
        'No stories found for this level': 'لم يتم العثور على قصص لهذا المستوى',
        'User stories are currently disabled in settings': 'قصص المستخدم معطلة حاليًا في الإعدادات',
        'Go to Add stories page to create your first story!': 'انتقل إلى صفحة إضافة القصص لإنشاء قصتك الأولى!',
        'Try another language or level.': 'جرّب لغة أو مستوى آخر.',
        'Try a different level!': 'جرّب مستوى آخر!',

        /* My Stories */
        'My Stories': 'قصصي',
        'Add stories': 'إضافة قصص',
        'Your personal library': 'مكتبتك الشخصية',
        'Stories': 'القصص',
        'From PDF': 'من PDF',
        'Words': 'الكلمات',
        'With translations': 'مع ترجمات',
        'Filters': 'عوامل التصفية',
        'Sort': 'الترتيب',
        'Newest first': 'الأحدث أولًا',
        'Oldest first': 'الأقدم أولًا',
        'Title A–Z': 'العنوان أ–ي',
        'Most words': 'الأكثر كلمات',
        'Fewest words': 'الأقل كلمات',
        'Difficulty': 'الصعوبة',
        'Advanced filters': 'عوامل تصفية متقدمة',
        'Reset all': 'إعادة ضبط الكل',
        'Reset filters': 'إعادة ضبط عوامل التصفية',
        'Source': 'المصدر',
        'All sources': 'كل المصادر',
        'PDF import': 'استيراد PDF',
        'JavaScript database': 'قاعدة بيانات JavaScript',
        'JSON file': 'ملف JSON',
        'Written in Studio': 'مكتوبة في الاستوديو',
        'Pasted text': 'نص ملصق',
        'Other / older stories': 'أخرى / قصص أقدم',
        'Language': 'اللغة',
        'All levels': 'كل المستويات',
        'CEFR': 'الإطار الأوروبي',
        'Any CEFR': 'أي مستوى CEFR',
        'Not set': 'غير محدد',
        'Tag': 'الوسم',
        'Any tag': 'أي وسم',
        'Features': 'الميزات',
        'Has translations': 'لديها ترجمات',
        'Has audio': 'لديها صوت',
        'Words (min)': 'الكلمات (الحد الأدنى)',
        'Words (max)': 'الكلمات (الحد الأقصى)',
        'Added from': 'أضيفت من',
        'Added to': 'أضيفت إلى',
        'Loading your stories…': 'جارٍ تحميل قصصك…',
        'Export filtered': 'تصدير المصفّى',
        'No stories yet': 'لا توجد قصص بعد',
        'Save a story from Stories Studio to see it here.': 'احفظ قصة من استوديو القصص لتظهر هنا.',
        'Open Stories Studio': 'افتح استوديو القصص',

        /* Studio */
        'Stories Studio': 'استوديو القصص',
        'Upload your custom stories in JSON format to read them with all interactive features.': 'حمّل قصصك المخصصة بصيغة JSON لقراءتها مع كل الميزات التفاعلية.',
        'Upload Story File': 'حمّل ملف القصة',
        'Upload a JSON file containing your story. The file should follow the specified format.': 'حمّل ملف JSON يحتوي قصتك. يجب أن يتبع الملف التنسيق المحدد.',
        'Drop your JSON file here': 'أفلت ملف JSON هنا',
        'or click to browse': 'أو انقر للتصفح',
        'Browse Files': 'تصفح الملفات',
        'Supported format: .json': 'التنسيق المدعوم: .json',
        'Upload Story': 'حمّل القصة',
        'Import from a story database or PDF': 'استيراد من قاعدة بيانات قصص أو PDF',
        'Story Database': 'قاعدة بيانات القصص',
        'Built-in source': 'مصدر مدمج',
        'Loading sources…': 'جارٍ تحميل المصادر…',
        'Browse stories': 'تصفح القصص',
        'Open local file': 'فتح ملف محلي',
        'Choose a story database to get started.': 'اختر قاعدة بيانات قصص للبدء.',
        'Import from PDF': 'استيراد من PDF',
        'Choose PDF': 'اختر PDF',
        'No PDF selected': 'لم يتم اختيار PDF',
        'Pages': 'الصفحات',
        'Clear': 'مسح',
        'Select range': 'تحديد نطاق',
        'Maximum 10 pages per import.': 'الحد الأقصى 10 صفحات لكل استيراد.',
        'Story title *': 'عنوان القصة *',
        'Author (optional)': 'المؤلف (اختياري)',
        'CEFR (optional)': 'CEFR (اختياري)',
        'None': 'لا شيء',
        'Tags (comma separated)': 'الوسوم (مفصولة بفواصل)',
        'Extracted text (editable)': 'النص المستخرج (قابل للتعديل)',
        'Extract selected pages': 'استخراج الصفحات المحددة',
        'Save story': 'حفظ القصة',
        'Save & Read': 'حفظ وقراءة',
        'Your Uploaded Stories': 'قصصك المحمّلة',
        'No stories uploaded yet': 'لم يتم تحميل قصص بعد',
        'Quick Add Form': 'نموذج الإضافة السريعة',
        'Prefer to type directly? Use this form to create your story:': 'تفضل الكتابة مباشرة؟ استخدم هذا النموذج لإنشاء قصتك:',
        'Story Title *': 'عنوان القصة *',
        'Difficulty Level *': 'مستوى الصعوبة *',
        'Select level': 'اختر المستوى',
        'Story Language *': 'لغة القصة *',
        'CEFR Level (Optional)': 'مستوى CEFR (اختياري)',
        'Select CEFR level (optional)': 'اختر مستوى CEFR (اختياري)',
        'Select the CEFR level that best matches your story': 'اختر مستوى CEFR الأنسب لقصتك',
        'Cover Emoji/Icon/Image URL': 'رابط رمز/أيقونة/صورة الغلاف',
        'Enter an emoji, FontAwesome class, or image URL': 'أدخل رمزًا تعبيريًا أو فئة FontAwesome أو رابط صورة',
        'Cover Type': 'نوع الغلاف',
        'Emoji': 'رمز تعبيري',
        'Icon': 'أيقونة',
        'Image': 'صورة',
        'Audio File URL (Optional)': 'رابط ملف الصوت (اختياري)',
        'Add audio narration for your story (MP3 recommended)': 'أضف سردًا صوتيًا لقصتك (يُوصى بـ MP3)',
        'External Dictionaries (Optional)': 'قواميس خارجية (اختياري)',
        'Add paths to external dictionary files (one per line, optional)': 'أضف مسارات ملفات القواميس الخارجية (سطر لكل ملف، اختياري)',
        'Example:': 'مثال:',
        'Story Content *': 'محتوى القصة *',
        'Each line will be treated as a separate paragraph': 'سيُعامل كل سطر كفقرة منفصلة',
        'Author Name (Optional)': 'اسم المؤلف (اختياري)',
        'Custom Translations (Optional)': 'ترجمات مخصصة (اختياري)',
        'Load Example': 'تحميل مثال',
        'Add your own translations for words in the story. This will override default translations.': 'أضف ترجماتك الخاصة لكلمات القصة. ستتجاوز الترجمات الافتراضية.',
        'Preview': 'معاينة',
        'Save Story': 'حفظ القصة',
        'Download Template': 'تحميل القالب',
        'Use our pre-formatted JSON template to ensure your story works perfectly.': 'استخدم قالب JSON الجاهز لدينا لضمان عمل قصتك بشكل مثالي.',
        'Download JSON Template': 'تحميل قالب JSON',
        'How to Create Your Story': 'كيف تنشئ قصتك',
        'Prepare Your Text': 'جهّز نصك',
        'Write your story in any text editor. Each paragraph should be on a new line.': 'اكتب قصتك في أي محرر نصوص. يجب أن تكون كل فقرة في سطر جديد.',
        'Add Translations (Optional)': 'أضف الترجمات (اختياري)',
        'Add custom translations for difficult words to help readers.': 'أضف ترجمات مخصصة للكلمات الصعبة لمساعدة القراء.',
        'Add Details': 'أضف التفاصيل',
        'Include title, difficulty level, CEFR level, cover, and optional audio.': 'أضف العنوان ومستوى الصعوبة ومستوى CEFR والغلاف والصوت الاختياري.',
        'Upload & Enjoy': 'حمّل واستمتع',
        'Upload your JSON file and start reading with interactive features!': 'حمّل ملف JSON وابدأ القراءة بالميزات التفاعلية!',
        'Export Your Stories': 'صدّر قصصك',
        'Export all your uploaded stories as a JSON file for backup or sharing.': 'صدّر كل قصصك المحمّلة كملف JSON للنسخ الاحتياطي أو المشاركة.',
        'Export All Stories': 'صدّر كل القصص',
        'Import from Text': 'استيراد من النص',
        'Complete JSON Format Example': 'مثال كامل لتنسيق JSON',
        'Copy': 'نسخ',
        'Source stories': 'قصص المصدر',
        'Select all visible': 'تحديد كل الظاهر',
        'Cancel': 'إلغاء',
        'Save selected': 'حفظ المحدد',
        'Story Preview': 'معاينة القصة',
        'Story Title': 'عنوان القصة',
        'Story description will appear here...': 'سيظهر وصف القصة هنا...',
        'Anonymous': 'مجهول',
        'Audio': 'صوت',
        'Story Content Preview:': 'معاينة محتوى القصة:',
        'Your story content will appear here...': 'سيظهر محتوى قصتك هنا...',
        'Custom Translations:': 'الترجمات المخصصة:',
        'Close': 'إغلاق',
        'Edit Story': 'تعديل القصة',
        'Save Changes': 'حفظ التغييرات',

        /* Settings */
        'Settings': 'الإعدادات',
        'One place for every page': 'مكان واحد لكل الصفحات',
        'Appearance': 'المظهر',
        'Theme': 'المظهر',
        'Light or dark mode': 'الوضع الفاتح أو الداكن',
        'Accent color': 'لون التمييز',
        'Primary colour used for buttons and highlights': 'اللون الأساسي المستخدم للأزرار والإبرازات',
        'Secondary color': 'اللون الثانوي',
        'Used for accents, badges and gradients': 'يُستخدم للتمييز والشارات والتدرجات',
        'Reading': 'القراءة',
        'Font family': 'نوع الخط',
        'Reading font used in the story reader': 'خط القراءة المستخدم في قارئ القصص',
        'Font size': 'حجم الخط',
        'Text size in the story reader (1.0–2.0 rem)': 'حجم النص في قارئ القصص (1.0–2.0 rem)',
        'Line spacing': 'تباعد الأسطر',
        'Comfortable or relaxed spacing between lines': 'تباعد مريح أو واسع بين الأسطر',
        'Normal': 'عادي',
        'Relaxed': 'واسع',
        'Translation': 'الترجمة',
        'Default translation language': 'لغة الترجمة الافتراضية',
        'Language used when translating a tapped word': 'اللغة المستخدمة عند ترجمة كلمة منقورة',
        'Auto-translate on tap': 'الترجمة التلقائية عند النقر',
        'Show the translation immediately when a word is tapped': 'إظهار الترجمة فورًا عند النقر على كلمة',
        'Paragraph translation': 'ترجمة الفقرة',
        'Translate a whole paragraph, not just single words': 'ترجمة الفقرة كاملة وليس الكلمات المفردة فقط',
        'Hide translated words': 'إخفاء الكلمات المترجمة',
        'Hide words that already have a saved translation': 'إخفاء الكلمات التي لديها ترجمة محفوظة',
        'Library & Quizzes': 'المكتبة والاختبارات',
        'Show my quizzes': 'إظهار اختباراتي',
        'Display the quizzes you created in the quiz page': 'عرض الاختبارات التي أنشأتها في صفحة الاختبار',
        'Vocabulary & Speech': 'المفردات والنطق',
        'Pronunciation buttons': 'أزرار النطق',
        'Show the speaker button next to saved words': 'إظهار زر السماعة بجانب الكلمات المحفوظة',
        'Auto-pronounce flashcards': 'النطق التلقائي للبطاقات',
        'Read a flashcard aloud when it appears': 'قراءة البطاقة بصوت مسموع عند ظهورها',
        'Custom CSS': 'CSS مخصص',
        'Data Management': 'إدارة البيانات',
        'Export my stories': 'تصدير قصصي',
        'Download the stories you created (with their translations) as a JSON file': 'نزّل القصص التي أنشأتها (مع ترجماتها) كملف JSON',
        'Export stories': 'تصدير القصص',
        'Delete my stories': 'حذف قصصي',
        'Permanently delete all stories you uploaded. This cannot be undone': 'حذف كل القصص التي حمّلتها نهائيًا. لا يمكن التراجع عن ذلك',
        'Delete stories': 'حذف القصص',
        'Backup all data': 'نسخ كل البيانات احتياطيًا',
        'Download a backup of everything saved on this device': 'نزّل نسخة احتياطية من كل ما هو محفوظ على هذا الجهاز',
        'Backup data': 'نسخ البيانات',
        'Restore data': 'استعادة البيانات',
        'Import a previously saved backup file, replacing what is on this device': 'استيراد ملف نسخة احتياطية محفوظ سابقًا، مع استبدال ما هو على هذا الجهاز',
        'Delete all data': 'حذف كل البيانات',
        'Remove everything saved on this device — stories, words, quizzes and settings': 'إزالة كل ما هو محفوظ على هذا الجهاز — القصص والكلمات والاختبارات والإعدادات',
        'Delete everything': 'حذف كل شيء',
        'About & reset': 'حول وإعادة الضبط',
        'Profile': 'الملف الشخصي',
        'Change the name and photo shown next to your stories': 'غيّر الاسم والصورة الظاهرين بجانب قصصك',
        'Open profile': 'فتح الملف الشخصي',
        'Version': 'الإصدار',
        'IStories 2.1.0 · by Ammar chacal': 'IStories 2.1.0 · بواسطة عمار شقل',
        'Refresh': 'تحديث',
        'Reset preferences': 'إعادة ضبط التفضيلات',
        'Restore theme, colours, reading and feature settings to their defaults. Your stories, words and quizzes are kept.': 'أعد المظهر والألوان والقراءة وإعدادات الميزات إلى افتراضياتها. تبقى قصصك وكلماتك واختباراتك محفوظة.',

        /* Reader */
        'Reader': 'القارئ',
        'Read Story': 'اقرأ القصة',
        'Loading Story...': 'جارٍ تحميل القصة...',
        'Exit': 'خروج',
        'Loading story content...': 'جارٍ تحميل محتوى القصة...',
        'Dictionary': 'القاموس',
        'Select a word in the story to see its translation.': 'اختر كلمة في القصة لترى ترجمتها.',
        'Save Word': 'حفظ الكلمة',
        'Already Saved': 'محفوظة بالفعل',
        'Save Word (No Translation)': 'حفظ الكلمة (دون ترجمة)',
        'Translate again': 'ترجم مرة أخرى',
        'Remove translation': 'إزالة الترجمة',
        'No translation': 'لا توجد ترجمة',
        'Copy Story': 'نسخ القصة',
        'You can copy the story text': 'يمكنك نسخ نص القصة',
        'Print Story': 'طباعة القصة',
        'You can Print the story as pdf': 'يمكنك طباعة القصة كملف PDF',
        'Download Story': 'تنزيل القصة',
        'You can download the story as json': 'يمكنك تنزيل القصة بصيغة JSON',
        'Default Translation Language': 'لغة الترجمة الافتراضية',
        'Choose language for word translations': 'اختر لغة ترجمة الكلمات',
        'Paragraph Translation': 'ترجمة الفقرة',
        'Enable paragraph-level translation tools': 'تفعيل أدوات ترجمة الفقرات',
        'No translated words': 'إخفاء الكلمات المترجمة',
        'Enable translated words': 'تفعيل الكلمات المترجمة',
        'Advanced Customization': 'تخصيص متقدم',
        'Add your own CSS styles': 'أضف أنماط CSS الخاصة بك',
        'Edit Custom CSS': 'تعديل CSS المخصص',
        'Reset All Settings': 'إعادة ضبط كل الإعدادات',
        'Restore default settings': 'استعادة الإعدادات الافتراضية',
        'Story Reader 3.1.0': 'قارئ القصص 3.1.0',
        'Author': 'المؤلف',
        'Refresh App': 'تحديث التطبيق',
        'Reload all data': 'إعادة تحميل كل البيانات',
        'Text-to-Speech': 'النطق الصوتي',
        'Listen to stories': 'استمع إلى القصص',
        'Enable': 'تفعيل',
        'Custom CSS Editor': 'محرر CSS المخصص',
        'Save CSS': 'حفظ CSS',
        'Your CSS will be applied to the entire application. Use with caution.': 'سيُطبّق CSS على التطبيق بأكمله. استخدمه بحذر.',

        /* Profile */
        'Change': 'تغيير',
        'JPG or PNG, up to 5 MB': 'JPG أو PNG، حتى 5 ميغابايت',
        'Use default photo': 'استخدام الصورة الافتراضية',
        'Your Name': 'اسمك',
        'This name is shown on your profile.': 'يظهر هذا الاسم في ملفك الشخصي.',
        'Reset': 'إعادة ضبط',
        'Save Changes': 'حفظ التغييرات',

        /* Vocabulary / flashcards */
        'Vocabulary': 'المفردات',
        'My Vocabulary': 'مفرداتي',
        'Export CSV': 'تصدير CSV',
        'Import': 'استيراد',
        'Remove all': 'إزالة الكل',
        'Total Words': 'إجمالي الكلمات',
        'Mastered': 'متقنة',
        'Due for Practice': 'مستحقة للمراجعة',
        'Day Streak': 'سلسلة الأيام',
        'Flashcards': 'البطاقات التعليمية',
        'Flashcard Practice': 'تدريب البطاقات',
        'Shuffle': 'خلط',
        'Reset Progress': 'إعادة ضبط التقدم',
        'No cards available': 'لا توجد بطاقات متاحة',
        'Add words from stories to practice them here': 'أضف كلمات من القصص لتدريبها هنا',
        'Click or tap to flip': 'انقر أو المس للقلب',
        'Again': 'مرة أخرى',
        'Hard': 'صعب',
        'Good': 'جيد',
        'Easy': 'سهل',
        'Session Progress': 'تقدم الجلسة',
        'Due Today': 'مستحق اليوم',
        'Total Cards': 'إجمالي البطاقات',
        'Learning': 'قيد التعلم',

        /* Quiz */
        'Quiz': 'اختبار',
        'Select Quiz Collection:': 'اختر مجموعة الاختبارات:',
        'Basic Arabic Quizzes': 'اختبارات عربية أساسية',
        'Advanced Arabic Quizzes': 'اختبارات عربية متقدمة',
        'All Levels': 'كل المستويات',
        'Upload Your Own Quiz': 'حمّل اختبارك الخاص',
        'Upload custom quizzes in JSON format or upload existing quizzes to test your knowledge.': 'حمّل اختبارات مخصصة بصيغة JSON أو اختبارات موجودة لاختبار معرفتك.',
        'Upload Quiz File': 'حمّل ملف الاختبار',
        'Upload a JSON file containing your quiz. The file should follow the quiz JSON format.': 'حمّل ملف JSON يحتوي اختبارك. يجب أن يتبع الملف تنسيق JSON الخاص بالاختبارات.',
        'Drop your quiz JSON file here': 'أفلت ملف JSON الخاص بالاختبار هنا',
        'Supported format: .json': 'التنسيق المدعوم: .json',
        'Upload Quiz': 'حمّل الاختبار',
        'Your Created Quizzes': 'اختباراتك المنشأة',
        'No quizzes created yet': 'لم يتم إنشاء اختبارات بعد',
        'Create your first quiz using the text area or file upload!': 'أنشئ اختبارك الأول باستخدام منطقة النص أو رفع الملف!',
        'Download Quiz Template': 'تحميل قالب الاختبار',
        'Use our pre-formatted JSON template to create quizzes that work perfectly.': 'استخدم قالب JSON الجاهز لدينا لإنشاء اختبارات تعمل بشكل مثالي.',
        'How to Create Your Quiz': 'كيف تنشئ اختبارك',
        'Plan Your Quiz': 'خطّط لاختبارك',
        'Decide on quiz title, description, level (beginner/intermediate/advanced), and type (vocab/grammar/etc).': 'حدّد عنوان الاختبار ووصفه ومستواه (مبتدئ/متوسط/متقدم) ونوعه (مفردات/قواعد/إلخ).',
        'Create Questions': 'أنشئ الأسئلة',
        'Add questions with different types: multiple choice, true/false, fill in blank, matching, or drag & drop.': 'أضف أسئلة بأنواع مختلفة: اختيار من متعدد، صح/خطأ، ملء الفراغ، مطابقة، أو سحب وإفلات.',
        'Add Answers & Explanations': 'أضف الإجابات والتفسيرات',
        'Mark correct answers and add explanations to help learners understand.': 'حدّد الإجابات الصحيحة وأضف تفسيرات لمساعدة المتعلمين على الفهم.',
        'Upload & Test': 'حمّل واختبر',
        'Upload your JSON file and test your quiz with all interactive features!': 'حمّل ملف JSON واختبر اختبارك بكل الميزات التفاعلية!',
        'Export Your Quizzes': 'صدّر اختباراتك',
        'Export all your created quizzes as a JSON file for backup or sharing with others.': 'صدّر كل اختباراتك كملف JSON للنسخ الاحتياطي أو المشاركة مع الآخرين.',
        'Export All Quizzes': 'صدّر كل الاختبارات',
        'Import Quiz from Text': 'استيراد اختبار من النص',
        'Complete Quiz JSON Format Example': 'مثال كامل لتنسيق JSON للاختبار',
        'Edit Quiz': 'تعديل الاختبار',
        'Quiz Title *': 'عنوان الاختبار *',
        'Description *': 'الوصف *',
        'Difficulty Level *': 'مستوى الصعوبة *',
        'Quiz Type *': 'نوع الاختبار *',
        'Select type': 'اختر النوع',
        'Vocabulary': 'المفردات',
        'Grammar': 'القواعد',
        'Reading': 'القراءة',
        'Listening': 'الاستماع',
        'Writing': 'الكتابة',
        'Mixed': 'مختلط',
        'Author Name (Optional)': 'اسم المؤلف (اختياري)',
        'Quiz Questions (JSON) *': 'أسئلة الاختبار (JSON) *',
        'Preview Quiz': 'معاينة الاختبار',
        'Test Quiz': 'اختبر الاختبار',
        'Quiz Title': 'عنوان الاختبار',
        'Quiz description': 'وصف الاختبار',
        'Start your learning streak!': 'ابدأ سلسلة تعلمك!',
        'Start Quiz': 'ابدأ الاختبار',
        'Previous': 'السابق',
        'Next': 'التالي',
        'Submit Quiz': 'إرسال الاختبار',
        'IStories Quizzes': 'اختبارات IStories',
        'Start Quiz': 'ابدأ الاختبار',
        'Retry Quiz': 'أعد الاختبار',
        'Test your knowledge': 'اختبر معرفتك',
        'Your Story': 'قصتك',
        'Saved': 'محفوظة',
        'Unknown': 'غير معروف',
        'Last:': 'الأخير:',
        'Best:': 'الأفضل:',
        'grammar': 'قواعد',
        'vocab': 'مفردات',
        'comprehension': 'فهم المقروء',
        'mixed': 'مختلط',
        'User-created quiz': 'اختبار أنشأه المستخدم',
        'Privacy Policy': 'سياسة الخصوصية',
        'Terms of Service': 'شروط الخدمة',

        /* Store / tools */
        'Story Store': 'متجر القصص',
        'Tools': 'الأدوات',
        'Toolkit': 'صندوق الأدوات',
        'IStories Tools': 'أدوات IStories',
        'CSV → Dictionary': 'CSV → قاموس',
        'Turn a CSV list of words and translations into a dictionary file the reader understands.': 'حوّل قائمة CSV من الكلمات والترجمات إلى ملف قاموس يفهمه القارئ.',
        'Open tool': 'افتح الأداة',
        'Text Analyzer': 'محلل النصوص',
        'Paste any text to see word counts, unique words and difficulty insights before you read.': 'ألصق أي نص لترى عدد الكلمات والكلمات الفريدة ومؤشرات الصعوبة قبل القراءة.',
        'Jump back in': 'تابع من حيث توقفت',
        'Story Store': 'متجر القصص',

        /* Miscellaneous UI */
        'Home': 'الرئيسية',
        'Help & guide': 'المساعدة والدليل',
        'Theme': 'المظهر',
        'Top': 'أعلى',
        'Loading…': 'جارٍ التحميل…',
        'Loading...': 'جارٍ التحميل...',
        'Search': 'بحث',
        'Open navigation': 'فتح التنقل',
        'Close navigation': 'إغلاق التنقل',
        'Main navigation': 'التنقل الرئيسي',
        'Custom': 'مخصص',
        'Optional': 'اختياري',
        'Selected': 'محدد',
        'No results found': 'لم يتم العثور على نتائج',
        'Something went wrong': 'حدث خطأ ما',
        'Please try again.': 'يرجى المحاولة مرة أخرى.',
        'Select all': 'تحديد الكل',
        'Remove': 'إزالة',
        'Delete': 'حذف',
        'Edit': 'تعديل',
        'Read': 'قراءة',
        'Export': 'تصدير',
        'Download': 'تنزيل',
        'Upload': 'رفع',
        'Save': 'حفظ',
        'Cancel': 'إلغاء',
        'Close': 'إغلاق',
        'Search stories': 'ابحث عن قصص',

        /* Profile / account */
        'Your name': 'اسمك',
        'Toggle dark mode': 'تبديل الوضع الداكن',
        'Dismiss notification': 'إغلاق الإشعار',
        'Tap to dismiss': 'انقر للإغلاق',

        /* Library dynamic labels */
        'Story language': 'لغة القصة',
        'User-added story': 'قصة أضافها المستخدم',
        'Showing {shown} of {total} stories': 'عرض {shown} من {total} قصة',

        /* My Stories */
        'Every story you saved in Stories Studio lives here — imported PDFs, stories copied from a JavaScript database, JSON uploads and stories written by hand.': 'كل قصة حفظتها في استوديو القصص تجدها هنا — ملفات PDF المستوردة، والقصص المنسوخة من قاعدة بيانات JavaScript، وملفات JSON المرفوعة، والقصص المكتوبة يدويًا.',
        'Save a story from Stories Studio — from a PDF, a JavaScript database, a JSON file or the quick-add form.': 'احفظ قصة من استوديو القصص — من ملف PDF أو قاعدة بيانات JavaScript أو ملف JSON أو نموذج الإضافة السريعة.',
        'No saved stories yet': 'لا توجد قصص محفوظة بعد',
        'JS database': 'قاعدة بيانات JS',
        'Studio': 'الاستوديو',
        'Text': 'نص',

        /* Studio import descriptions */
        'Open a .js or .json database such as database/database/main.js, then read or save any story it contains.': 'افتح قاعدة بيانات .js أو .json مثل database/database/main.js، ثم اقرأ أو احفظ أي قصة تحتويها.',
        'Choose up to 10 pages from a PDF, extract their text, edit it, and save it as a story.': 'اختر حتى 10 صفحات من ملف PDF، واستخرج نصها، وحرّره، ثم احفظه كقصة.',
        'Drag & drop a PDF here, or click to browse': 'اسحب ملف PDF وأفلته هنا، أو انقر للتصفح',
        'Select the pages you want to import, then extract their text.': 'اختر الصفحات التي تريد استيرادها، ثم استخرج نصها.',

        /* Settings */
        'Each page has its own stylesheet. Pick a page, add CSS, and it is applied there with the same rules the in-page editor uses. Clearing only removes that page\'s CSS.': 'لكل صفحة ملف أنماط خاص بها. اختر صفحة، وأضف CSS، ليُطبّق عليها بنفس قواعد المحرر داخل الصفحة. المسح يزيل CSS تلك الصفحة فقط.',
        'by Ammar chacal': 'بواسطة عمار شقل',

        /* Vocabulary / flashcards */
        'No words saved yet. Click on words in stories to add them to your vocabulary.': 'لم تُحفظ كلمات بعد. انقر على الكلمات في القصص لإضافتها إلى مفرداتك.',
        'Add words to practice': 'أضف كلمات للتدريب',
        'Save words to practice them here': 'احفظ الكلمات لتدريبها هنا',

        /* Store / tools dynamic labels */
        'words': 'كلمة',
        'min read': 'دقيقة قراءة',
        'Save Story': 'حفظ القصة',
        'Small utilities that help you build and study your own material — convert word lists, analyse any text, and jump straight into the rest of the app.': 'أدوات صغيرة تساعدك على بناء موادك ودراستها — حوّل قوائم الكلمات، وحلّل أي نص، وانتقل مباشرة إلى بقية التطبيق.',

        /* Quiz metadata */
        'questions': 'أسئلة',
        'min': 'دقيقة',
        'Created': 'أُنشئ',
        'Not attempted yet': 'لم تتم المحاولة بعد',
        'GRAMMAR': 'قواعد',
        'VOCAB': 'مفردات',
        'COMPREHENSION': 'فهم المقروء',
        'MIXED': 'مختلط',
        'Completed': 'مكتمل',
        'In progress': 'قيد التقدم',
        'True': 'صح',
        'False': 'خطأ',

        /* Common toasts / errors */
        'Story not found!': 'لم يتم العثور على القصة!',
        'Story not found.': 'لم يتم العثور على القصة.',
        'Copy failed': 'فشل النسخ',
        'No word selected': 'لم يتم تحديد كلمة',
        'Word already saved!': 'الكلمة محفوظة بالفعل!',
        'Word saved!': 'تم حفظ الكلمة!',
        'Story copied!': 'تم نسخ القصة!',
        'No story to copy': 'لا توجد قصة لنسخها',
        'All settings have been reset to default!': 'تمت إعادة ضبط كل الإعدادات إلى الافتراضي!',
        '🎁 Daily bonus! +25 XP for logging in today!': '🎁 مكافأة يومية! +25 نقطة خبرة لتسجيل الدخول اليوم!',
        'Daily login bonus': 'مكافأة تسجيل الدخول اليومية',
        'Custom primary color applied': 'تم تطبيق اللون الأساسي المخصص',
        'Custom primary color saved': 'تم حفظ اللون الأساسي المخصص',
        'Custom secondary color applied': 'تم تطبيق اللون الثانوي المخصص',
        'Custom secondary color saved': 'تم حفظ اللون الثانوي المخصص',
        'Story not found. It may have been deleted.': 'لم يتم العثور على القصة. ربما حُذفت.',
        'Error opening story. Please try again.': 'حدث خطأ أثناء فتح القصة. يرجى المحاولة مرة أخرى.',
        'Custom CSS saved successfully!': 'تم حفظ CSS المخصص بنجاح!',
        'Custom CSS cleared!': 'تم مسح CSS المخصص!',
        'Cards shuffled!': 'تم خلط البطاقات!',
        'Card progress reset!': 'تمت إعادة ضبط تقدم البطاقات!',
        'Photo reset to default.': 'تمت إعادة الصورة إلى الافتراضية.',
        'Profile updated successfully!': 'تم تحديث الملف الشخصي بنجاح!',
        'Please enter your name': 'يرجى إدخال اسمك',
        'Please select an image file': 'يرجى اختيار ملف صورة',
        'File size must be less than 5MB': 'يجب أن يكون حجم الملف أقل من 5 ميغابايت',
        'No vocabulary to export!': 'لا توجد مفردات للتصدير!',
        'All saved words removed successfully!': 'تمت إزالة كل الكلمات المحفوظة بنجاح!',
        'Translation refreshed': 'تم تحديث الترجمة',
        'Failed to translate word': 'تعذّر ترجمة الكلمة',
        'Failed to refresh translation': 'تعذّر تحديث الترجمة',
        'Paragraph translated successfully': 'تمت ترجمة الفقرة بنجاح',
        'Paragraph translation enabled': 'تم تفعيل ترجمة الفقرة',
        'Paragraph translation disabled': 'تم تعطيل ترجمة الفقرة',
        'Speech synthesis not supported': 'النطق الصوتي غير مدعوم',
        'Text-to-speech is not supported in your browser.': 'النطق الصوتي غير مدعوم في متصفحك.',
        'Error playing audio.': 'خطأ في تشغيل الصوت.',
        'No word to speak': 'لا توجد كلمة للنطق',
        'Please fill in all required fields.': 'يرجى ملء جميع الحقول المطلوبة.',
        'Please fill in all required fields to preview.': 'يرجى ملء جميع الحقول المطلوبة للمعاينة.',
        'Invalid story format. Please check the template.': 'تنسيق القصة غير صالح. يرجى التحقق من القالب.',
        'Story updated successfully!': 'تم تحديث القصة بنجاح!',
        'Story and translations deleted successfully.': 'تم حذف القصة والترجمات بنجاح.',
        'Quiz deleted successfully.': 'تم حذف الاختبار بنجاح.',
        'Quiz updated successfully!': 'تم تحديث الاختبار بنجاح!',
        'This story is already saved!': 'هذه القصة محفوظة بالفعل!',
        'No story loaded to download': 'لا توجد قصة محمّلة للتنزيل',
        'Failed to download story. Please try again.': 'تعذّر تنزيل القصة. يرجى المحاولة مرة أخرى.',
        'No recent stories found. Start reading to build your history!': 'لا توجد قصص حديثة. ابدأ القراءة لبناء سجلك!',
        'Reading history cleared!': 'تم مسح سجل القراءة!',
        'This function needs Internet.': 'هذه الوظيفة تحتاج إلى إنترنت.',
        'Opening Google Translate...': 'جارٍ فتح Google Translate...',
        'Translation closed': 'تم إغلاق الترجمة',
        'Translation failed': 'فشلت الترجمة',
        'Example translations loaded!': 'تم تحميل الترجمات النموذجية!',
        'Text area cleared': 'تم مسح منطقة النص'
    };

    /* Build an English → Arabic lookup from both catalogues. */
    var PHRASE_MAP = Object.create(null);
    Object.keys(STATIC_PHRASES).forEach(function (english) {
        PHRASE_MAP[english] = STATIC_PHRASES[english];
    });
    Object.keys(MESSAGES).forEach(function (key) {
        var pair = MESSAGES[key];
        if (!pair || !pair[0] || !pair[1]) return;
        if (!PHRASE_MAP[pair[0]]) PHRASE_MAP[pair[0]] = pair[1];
    });

    /* Never auto-translate these very short / technical strings. */
    var SKIP_AUTO = /^(?:[A-Z]{1,4}|A\d|B\d|C\d|XP|PDF|JSON|CSV|CSS|CEFR|IStories|IStories.*)$/;

    /* ----------------------------------------------------------------------
       Helpers
       ---------------------------------------------------------------------- */
    function readStoredLanguage() {
        try {
            var stored = localStorage.getItem(LANG_KEY);
            if (SUPPORTED.indexOf(stored) !== -1) return stored;
        } catch (error) { /* private mode */ }
        return 'en';
    }

    var current = readStoredLanguage();

    function normalize(value) {
        return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
    }

    function interpolate(text, vars) {
        if (!vars) return text;
        return String(text).replace(/\{(\w+)\}/g, function (match, name) {
            return Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : match;
        });
    }

    function t(key, vars) {
        var pair = MESSAGES[key];
        if (!pair) return key;
        return interpolate(pair[current === 'ar' ? 1 : 0] || pair[0], vars);
    }

    /** Counts and other templated UI strings that are built in page scripts. */
    function translateDynamic(text) {
        var m = text.match(/^🌍\s*All languages(?:\s*\((\d+)\))?$/i);
        if (m) return '🌍 كل اللغات' + (m[1] ? ' (' + m[1] + ')' : '');

        m = text.match(/^All languages(?:\s*\((\d+)\))?$/i);
        if (m) return 'كل اللغات' + (m[1] ? ' (' + m[1] + ')' : '');

        m = text.match(/^(\d+)\s+words?$/i);
        if (m) return m[1] + ' كلمة';
        m = text.match(/^(\d+)\s+min(?:ute)?s?\s+read$/i);
        if (m) return m[1] + ' دقيقة قراءة';
        m = text.match(/^(\d+)\s+min(?:ute)?s?$/i);
        if (m) return m[1] + ' دقيقة';
        m = text.match(/^(\d+)\s+questions?$/i);
        if (m) return m[1] + ' أسئلة';
        m = text.match(/^(\d+)\s+attempts?$/i);
        if (m) return m[1] + ' محاولة';
        m = text.match(/^(\d+)\s+pages? selected$/i);
        if (m) return 'تم تحديد ' + m[1] + ' صفحات';
        m = text.match(/^(\d+)\s+of\s+(\d+)\s+stories$/i);
        if (m) return 'عرض ' + m[1] + ' من ' + m[2] + ' قصة';
        m = text.match(/^(\d+)\s+of\s+(\d+)\s+cards$/i);
        if (m) return m[1] + ' من ' + m[2] + ' بطاقة';
        m = text.match(/^Created:\s*(.+)$/i);
        if (m) return 'أُنشئ: ' + m[1];
        m = text.match(/^(\d+)\s+translations?\s+saved\.?$/i);
        if (m) return 'تم حفظ ' + m[1] + ' ترجمة.';
        m = text.match(/^(\d+)\s+days?$/i);
        if (m) return m[1] + ' أيام';
        m = text.match(/^🎉\s*Level Up! You reached level (\d+)!$/i);
        if (m) return '🎉 ارتقيت! وصلت إلى المستوى ' + m[1] + '!';
        m = text.match(/^User stories (enabled|disabled)$/i);
        if (m) return m[1].toLowerCase() === 'enabled' ? 'تم تفعيل قصص المستخدم' : 'تم تعطيل قصص المستخدم';
        m = text.match(/^Secondary color changed to (.+)$/i);
        if (m) return 'تم تغيير اللون الثانوي إلى ' + m[1];
        m = text.match(/^Primary color changed to (.+)$/i);
        if (m) return 'تم تغيير اللون الأساسي إلى ' + m[1];
        return null;
    }

    /** Translate a complete English UI phrase (used by showNotification etc.). */
    function translateMessage(text) {
        if (current !== 'ar' || !text) return text;
        var normalized = normalize(text);
        if (PHRASE_MAP[normalized]) return PHRASE_MAP[normalized];
        var dynamic = translateDynamic(normalized);
        return dynamic != null ? dynamic : text;
    }

    /* ----------------------------------------------------------------------
       DOM translation
       ---------------------------------------------------------------------- */
    var originalText = new WeakMap();
    var originalAttributes = new WeakMap();
    var EXCLUDED_SELECTOR = [
        '[data-no-i18n]',
        '[data-dir-auto]',
        '#storyText',
        '.story-text',
        '.story-content .story-title',
        '.story-content p',
        '.word',
        '.dictionary-translation',
        '.dictionary-word',
        '.translation-value',
        '.preview-story-content',
        '.source-story-content',
        '.user-text',
        'script',
        'style',
        'noscript',
        'textarea',
        'code',
        'pre'
    ].join(',');

    function isExcluded(node) {
        var element = node.nodeType === 1 ? node : node.parentElement;
        return !!(element && element.closest && element.closest(EXCLUDED_SELECTOR));
    }

    function explicitTextValue(element) {
        var key = element.getAttribute('data-i18n');
        if (!key) return null;
        var pair = MESSAGES[key];
        if (!pair) return null;
        return pair[current === 'ar' ? 1 : 0] || pair[0];
    }

    function applyExplicitAttributes(element) {
        var placeholderKey = element.getAttribute('data-i18n-placeholder');
        if (placeholderKey && MESSAGES[placeholderKey]) {
            element.setAttribute('placeholder', t(placeholderKey));
        }
        var ariaKey = element.getAttribute('data-i18n-aria-label');
        if (ariaKey && MESSAGES[ariaKey]) {
            element.setAttribute('aria-label', t(ariaKey));
        }
        var titleKey = element.getAttribute('data-i18n-title');
        if (titleKey && MESSAGES[titleKey]) {
            element.setAttribute('title', t(titleKey));
        }
        var htmlKey = element.getAttribute('data-i18n-html');
        if (htmlKey && MESSAGES[htmlKey]) {
            element.innerHTML = t(htmlKey);
        }
    }

    function translateTextNode(node) {
        if (!node || !node.nodeValue) return;
        if (isExcluded(node)) return;

        var raw = node.nodeValue;
        var normalized = normalize(raw);
        if (!normalized || SKIP_AUTO.test(normalized)) return;

        if (current === 'ar') {
            var translated = PHRASE_MAP[normalized] || translateDynamic(normalized);
            if (!translated) return;
            if (!originalText.has(node)) originalText.set(node, raw);
            var leading = (raw.match(/^\s*/) || [''])[0];
            var trailing = (raw.match(/\s*$/) || [''])[0];
            var next = leading + translated + trailing;
            if (node.nodeValue !== next) node.nodeValue = next;
        } else {
            var original = originalText.get(node);
            if (original != null && node.nodeValue !== original) {
                node.nodeValue = original;
            }
        }
    }

    function translateAttributes(element) {
        if (!element || element.nodeType !== 1 || isExcluded(element)) return;
        ['placeholder', 'aria-label', 'title'].forEach(function (attribute) {
            var value = element.getAttribute(attribute);
            if (!value) return;
            var normalized = normalize(value);
            if (!normalized || SKIP_AUTO.test(normalized)) return;
            var store = originalAttributes.get(element);
            if (!store) {
                store = Object.create(null);
                originalAttributes.set(element, store);
            }
            if (!(attribute in store)) store[attribute] = value;

            if (current === 'ar') {
                var translated = PHRASE_MAP[normalized];
                if (translated && element.getAttribute(attribute) !== translated) {
                    element.setAttribute(attribute, translated);
                }
            } else if (store[attribute] != null) {
                if (element.getAttribute(attribute) !== store[attribute]) {
                    element.setAttribute(attribute, store[attribute]);
                }
            }
        });
    }

    function translateElement(element) {
        if (!element || element.nodeType !== 1) return;
        var explicit = explicitTextValue(element);
        if (explicit != null && element.textContent !== explicit) {
            element.textContent = explicit;
        }
        applyExplicitAttributes(element);
    }

    function collect(root, selector) {
        var nodes = [];
        if (!root || !root.querySelectorAll) return nodes;
        if (root.nodeType === 1 && root.matches && root.matches(selector)) nodes.push(root);
        var found = root.querySelectorAll(selector);
        for (var i = 0; i < found.length; i++) nodes.push(found[i]);
        return nodes;
    }

    function translateDOM(root) {
        if (!root) return;
        if (root.nodeType === 1 && root === document.documentElement) {
            // Titles live in <head>, outside <body>.
            Array.prototype.forEach.call(document.querySelectorAll('title'), function (title) {
                if (title.hasAttribute('data-i18n')) translateElement(title);
                else if (!title.hasAttribute('data-no-i18n')) translateTextNode(title.firstChild);
            });
        }

        collect(root, '[data-i18n]').forEach(translateElement);
        collect(root, '[data-i18n-html]').forEach(translateElement);
        collect(root, '[data-i18n-placeholder]').forEach(applyExplicitAttributes);
        collect(root, '[data-i18n-aria-label]').forEach(applyExplicitAttributes);
        collect(root, '[data-i18n-title]').forEach(applyExplicitAttributes);

        // Auto-translate text nodes and common UI attributes.
        var elementRoot = root.nodeType === 1 ? root : document.body;
        if (!elementRoot) return;
        collect(elementRoot, '*').forEach(translateAttributes);
        if (document.createTreeWalker) {
            var walker = document.createTreeWalker(elementRoot, NodeFilter.SHOW_TEXT, null, false);
            var textNode;
            while ((textNode = walker.nextNode())) {
                if (textNode.parentElement && textNode.parentElement.closest(EXCLUDED_SELECTOR)) continue;
                if (textNode.parentElement && textNode.parentElement.closest('[data-i18n],[data-i18n-html]')) continue;
                translateTextNode(textNode);
            }
        }
    }

    /* ----------------------------------------------------------------------
       Language switching
       ---------------------------------------------------------------------- */
    var observer = null;
    var pendingTimer = null;

    function disconnectObserver() {
        if (observer) observer.disconnect();
    }

    function reconnectObserver() {
        if (!observer || !document.body) return;
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function scheduleTranslation() {
        if (pendingTimer) return;
        pendingTimer = setTimeout(function () {
            pendingTimer = null;
            disconnectObserver();
            translateDOM(document.documentElement);
            reconnectObserver();
        }, 30);
    }

    function syncSwitchers() {
        collect(document, '[data-set-lang]').forEach(function (button) {
            var active = button.getAttribute('data-set-lang') === current;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        collect(document, '[data-language-toggle]').forEach(function (button) {
            var target = current === 'ar' ? 'English' : 'العربية';
            var label = current === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';
            button.setAttribute('aria-label', label);
            button.setAttribute('title', label);
            var text = button.querySelector('[data-language-label]');
            if (text) text.textContent = target;
        });
    }

    function applyDocumentLanguage(lang) {
        lang = SUPPORTED.indexOf(lang) !== -1 ? lang : 'en';
        current = lang;
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        html.setAttribute('data-lang', lang);
        html.classList.toggle('ist-lang-ar', lang === 'ar');
        html.classList.toggle('ist-lang-en', lang === 'en');
        if (document.body) {
            document.body.classList.toggle('ist-lang-ar', lang === 'ar');
            document.body.classList.toggle('ist-lang-en', lang === 'en');
        }
    }

    function setLanguage(lang, options) {
        options = options || {};
        lang = SUPPORTED.indexOf(lang) !== -1 ? lang : 'en';
        current = lang;
        if (options.persist !== false) {
            try { localStorage.setItem(LANG_KEY, lang); } catch (error) { /* ignore */ }
        }

        applyDocumentLanguage(lang);
        disconnectObserver();
        if (document.body) translateDOM(document.documentElement);
        reconnectObserver();
        syncSwitchers();

        document.dispatchEvent(new CustomEvent('ist-language-change', {
            detail: { lang: lang, dir: lang === 'ar' ? 'rtl' : 'ltr' }
        }));
    }

    function toggleLanguage() {
        setLanguage(current === 'ar' ? 'en' : 'ar');
    }

    /* ----------------------------------------------------------------------
       Init + public API
       ---------------------------------------------------------------------- */
    applyDocumentLanguage(current);

    function init() {
        setLanguage(current, { persist: false });
        observer = new MutationObserver(function () {
            scheduleTranslation();
        });
        reconnectObserver();

        // One delegated handler covers every language switcher on every page.
        document.addEventListener('click', function (event) {
            var setButton = event.target.closest && event.target.closest('[data-set-lang]');
            if (setButton) {
                event.preventDefault();
                setLanguage(setButton.getAttribute('data-set-lang'));
                return;
            }
            var toggle = event.target.closest && event.target.closest('[data-language-toggle]');
            if (toggle) {
                event.preventDefault();
                toggleLanguage();
            }
        });

        // Optional ?lang=ar deep link.
        try {
            var requested = new URLSearchParams(location.search).get('lang');
            if (requested && SUPPORTED.indexOf(requested) !== -1 && requested !== current) {
                setLanguage(requested);
            }
        } catch (error) { /* ignore */ }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.IStoriesI18n = {
        get language() { return current; },
        get direction() { return current === 'ar' ? 'rtl' : 'ltr'; },
        isRtl: function () { return current === 'ar'; },
        languages: SUPPORTED.slice(),
        storageKey: LANG_KEY,
        t: t,
        translate: translateMessage,
        translateMessage: translateMessage,
        translateDOM: translateDOM,
        setLanguage: setLanguage,
        toggle: toggleLanguage,
        syncSwitchers: syncSwitchers,
        refresh: function () { translateDOM(document.documentElement); syncSwitchers(); }
    };
})();
