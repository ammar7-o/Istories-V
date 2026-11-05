// Translated story database — fully self-contained example
// ======================================================================
// This single file contains everything the reader needs:
//
//   1. the stories,
//   2. their paragraph translations ("content-tr"), and
//   3. the complete shared dictionary (the "dictionary" object below).
//
// No external dictionary file is required. Each story keeps its translations
// in the same object as its text, with exactly one translation string for
// every string in the matching "content" array:
//
//   "content":    ["paragraph 1", "paragraph 2", ...]
//   "content-tr": ["translation 1", "translation 2", ...]
//
// The reader detects each story's direction from "lang" and from the text
// itself, so an Arabic story is RTL even when the interface is English.
// The embedded dictionary has English, French, and Arabic word maps.

window.storiesData = {
    "stories": [
        {
            "id": 9001,
            "lang": "en",
            "title": "The Brass Key",
            "level": "intermediate",
            "levelcefr": "B1",
            "cover": "🗝️",
            "coverType": "emoji",
            "author": "IStories",
            "tags": [
                "example",
                "translation",
                "mystery"
            ],
            "content": [
                "Maya found a small <span class='mark'>brass key</span> under the old oak tree. It was cold in her hand and covered with tiny scratches.",
                "She tried the key in every door of the house, but none of them opened. Her grandmother smiled and pointed toward the garden shed.",
                "Inside the shed, a wooden box waited on the top shelf. The key turned with a soft click, and the lid lifted easily.",
                "The box held a bundle of letters and a photograph of two young friends. Maya realized that some treasures are made of memories, not gold."
            ],
            "content-tr": [
                "وجدت مايا مفتاحًا نحاسيًا صغيرًا تحت شجرة البلوط القديمة. كان باردًا في يدها ومغطى بخدوش دقيقة.",
                "جرّبت المفتاح في كل باب في المنزل، لكن أيًّا منها لم يُفتح. ابتسمت جدتها وأشارت نحو سقيفة الحديقة.",
                "داخل السقيفة، كان صندوق خشبي ينتظر على الرف العلوي. دار المفتاح بطرقة خفيفة، وارتفع الغطاء بسهولة.",
                "احتوى الصندوق على رزمة رسائل وصورة لصديقين شابين. أدركت مايا أن بعض الكنوز مصنوعة من الذكريات، لا من الذهب."
            ],
            "wordCount": 68
        },
        {
            "id": 9002,
            "lang": "ar",
            "title": "في السوق القديم",
            "level": "beginner",
            "levelcefr": "A2",
            "cover": "🛍️",
            "coverType": "emoji",
            "author": "IStories",
            "tags": [
                "مثال",
                "ترجمة",
                "حياة يومية"
            ],
            "content": [
                "في صباح مشمس، ذهبت ليلى إلى <span class='mark'>السوق</span> القديم لشراء الخضروات. كانت الأكشاك مليئة بالطماطم الحمراء والليمون الأصفر.",
                "سمعت بائعًا ينادي على بضاعته بصوت عالٍ، ورأت طفلًا يساعد أمه في حمل السلة. كان المكان مزدحمًا بالحياة.",
                "اشترت ليلى خبزًا طازجًا وحزمة نعناع، ثم توقفت عند كشك صغير لبيع الكتب المستعملة.",
                "عادت إلى البيت وهي تحمل كيسًا ثقيلًا وكتابًا قديمًا. قالت إن السوق ليس مكانًا للشراء فقط، بل مكان للقصص أيضًا."
            ],
            "content-tr": [
                "On a sunny morning, Layla went to the old market to buy vegetables. The stalls were full of red tomatoes and yellow lemons.",
                "She heard a vendor calling out his goods in a loud voice, and saw a child helping his mother carry a basket. The place was full of life.",
                "Layla bought fresh bread and a bunch of mint, then stopped at a small stall selling second-hand books.",
                "She returned home carrying a heavy bag and an old book. She said the market is not only a place to buy things, but also a place for stories."
            ],
            "translations": {
                "adolescents": "اليافعون / المراهقون",

            },
                "wordCount": 58
            }
    ],
    "dictionary": {
        "$schema": "istories-shared-dictionary",
        "version": 1,
        "description": "Complete offline dictionary embedded in example-translations.js. English, French and Arabic entries are stored here, so these stories need no separate dictionary file.",
        "generated": "2026-11-04",
        "defaultLanguage": "en",
        "languages": {
            "en": {
                "a": {
                    "translation": "ـ (أداة نكرة)"
                },
                "ability": {
                    "translation": "قدرة"
                },
                "able": {
                    "translation": "قادر"
                },
                "about": {
                    "translation": "عن"
                },
                "above": {
                    "translation": "فوق"
                },
                "abundant": {
                    "translation": "وفير"
                },
                "accept": {
                    "translation": "يقبل"
                },
                "accident": {
                    "translation": "حادث"
                },
                "accompany": {
                    "translation": "يرافق"
                },
                "according": {
                    "translation": "وفقاً"
                },
                "achievement": {
                    "translation": "إنجاز"
                },
                "acquaintances": {
                    "translation": "معارف"
                },
                "across": {
                    "translation": "عبر"
                },
                "act": {
                    "translation": "يتصرف / فعل"
                },
                "action": {
                    "translation": "عمل / إجراء"
                },
                "active": {
                    "translation": "نشيط"
                },
                "activity": {
                    "translation": "نشاط"
                },
                "actor": {
                    "translation": "ممثل"
                },
                "actually": {
                    "translation": "في الواقع"
                },
                "adapt": {
                    "translation": "يتكيف"
                },
                "adaptability": {
                    "translation": "قابلية التكيف"
                },
                "add": {
                    "translation": "يضيف"
                },
                "address": {
                    "translation": "يعالج"
                },
                "adjust": {
                    "translation": "يضبط"
                },
                "administration": {
                    "translation": "إدارة"
                },
                "admire": {
                    "translation": "يعجب بـ"
                },
                "adult": {
                    "translation": "بالغ"
                },
                "advance": {
                    "translation": "يتقدم"
                },
                "adventure": {
                    "translation": "مغامرة"
                },
                "advice": {
                    "translation": "نصيحة"
                },
                "advise": {
                    "translation": "ينصح"
                },
                "affect": {
                    "translation": "يؤثر"
                },
                "afraid": {
                    "translation": "خائف"
                },
                "after": {
                    "translation": "بعد"
                },
                "afternoon": {
                    "translation": "بعد الظهر"
                },
                "again": {
                    "translation": "مرة أخرى"
                },
                "against": {
                    "translation": "ضد"
                },
                "age": {
                    "translation": "عمر"
                },
                "agency": {
                    "translation": "وكالة"
                },
                "ago": {
                    "translation": "منذ"
                },
                "agree": {
                    "translation": "يوافق"
                },
                "aim": {
                    "translation": "يستهدف"
                },
                "air": {
                    "translation": "هواء"
                },
                "airport": {
                    "translation": "مطار"
                },
                "all": {
                    "translation": "كل"
                },
                "allow": {
                    "translation": "يسمح"
                },
                "ally": {
                    "translation": "حليف"
                },
                "almost": {
                    "translation": "تقريباً"
                },
                "alone": {
                    "translation": "وحيد"
                },
                "along": {
                    "translation": "على طول"
                },
                "already": {
                    "translation": "بالفعل"
                },
                "also": {
                    "translation": "أيضاً"
                },
                "alter": {
                    "translation": "يغيّر"
                },
                "although": {
                    "translation": "رغم أن"
                },
                "altogether": {
                    "translation": "إجمالًا"
                },
                "always": {
                    "translation": "دائماً"
                },
                "amaze": {
                    "translation": "يُذهل"
                },
                "ambition": {
                    "translation": "طموح"
                },
                "ambulance": {
                    "translation": "سيارة إسعاف"
                },
                "American": {
                    "translation": "أمريكي"
                },
                "among": {
                    "translation": "بين"
                },
                "amount": {
                    "translation": "كمية"
                },
                "an": {
                    "translation": "ـ (أداة نكرة قبل أحرف العلة)"
                },
                "analysis": {
                    "translation": "تحليل"
                },
                "analyze": {
                    "translation": "يحلل"
                },
                "and": {
                    "translation": "و"
                },
                "anger": {
                    "translation": "غضب"
                },
                "angry": {
                    "translation": "غاضب"
                },
                "animal": {
                    "translation": "حيوان"
                },
                "announce": {
                    "translation": "يعلن"
                },
                "annoy": {
                    "translation": "يضايق"
                },
                "another": {
                    "translation": "آخر"
                },
                "answer": {
                    "translation": "إجابة / يجيب"
                },
                "any": {
                    "translation": "أيّ"
                },
                "anyone": {
                    "translation": "أي أحد"
                },
                "anything": {
                    "translation": "أي شيء"
                },
                "anyway": {
                    "translation": "على أي حال"
                },
                "anywhere": {
                    "translation": "أي مكان"
                },
                "apartment": {
                    "translation": "شقة"
                },
                "apartments": {
                    "translation": "شقق"
                },
                "apologize": {
                    "translation": "يعتذر"
                },
                "appear": {
                    "translation": "يظهر"
                },
                "apple": {
                    "translation": "تفاحة"
                },
                "apply": {
                    "translation": "يقدم طلب / يطبق"
                },
                "appointment": {
                    "translation": "موعد"
                },
                "apprehensive": {
                    "translation": "قلق"
                },
                "approach": {
                    "translation": "مقاربة / يقترب"
                },
                "april": {
                    "translation": "أبريل"
                },
                "architect": {
                    "translation": "معماري"
                },
                "area": {
                    "translation": "منطقة"
                },
                "argue": {
                    "translation": "يجادل"
                },
                "arm": {
                    "translation": "ذراع / سلاح"
                },
                "around": {
                    "translation": "حول"
                },
                "arrange": {
                    "translation": "يرتب"
                },
                "arrival": {
                    "translation": "وصول"
                },
                "arrive": {
                    "translation": "يصل"
                },
                "art": {
                    "translation": "فن"
                },
                "article": {
                    "translation": "مقال"
                },
                "artist": {
                    "translation": "فنان"
                },
                "as": {
                    "translation": "مثل / كما"
                },
                "ask": {
                    "translation": "يسأل"
                },
                "aspect": {
                    "translation": "جانب"
                },
                "assess": {
                    "translation": "يقيّم"
                },
                "assistance": {
                    "translation": "مساعدة"
                },
                "association": {
                    "translation": "جمعية"
                },
                "at": {
                    "translation": "في / عند"
                },
                "athlete": {
                    "translation": "رياضي"
                },
                "atmosphere": {
                    "translation": "جو"
                },
                "attach": {
                    "translation": "يرفق"
                },
                "attack": {
                    "translation": "هجوم / يهاجم"
                },
                "attempt": {
                    "translation": "يحاول"
                },
                "attend": {
                    "translation": "يحضر"
                },
                "attention": {
                    "translation": "انتباه"
                },
                "attitude": {
                    "translation": "موقف"
                },
                "attract": {
                    "translation": "يجذب"
                },
                "audience": {
                    "translation": "جمهور"
                },
                "august": {
                    "translation": "أغسطس"
                },
                "aunt": {
                    "translation": "عمة / خالة"
                },
                "author": {
                    "translation": "مؤلف"
                },
                "authority": {
                    "translation": "سلطة"
                },
                "autumn": {
                    "translation": "خريف"
                },
                "available": {
                    "translation": "متاح"
                },
                "avenue": {
                    "translation": "جادة"
                },
                "avoid": {
                    "translation": "يتجنب"
                },
                "award": {
                    "translation": "جائزة"
                },
                "awareness": {
                    "translation": "وعي"
                },
                "away": {
                    "translation": "بعيداً"
                },
                "axis": {
                    "translation": "محور"
                },
                "baby": {
                    "translation": "طفل رضيع"
                },
                "back": {
                    "translation": "عودة / خلف"
                },
                "backgrounds": {
                    "translation": "خلفيات"
                },
                "backpack": {
                    "translation": "حقيبة ظهر"
                },
                "bad": {
                    "translation": "سيء"
                },
                "bag": {
                    "translation": "حقيبة"
                },
                "baggage": {
                    "translation": "أمتعة"
                },
                "bake": {
                    "translation": "يخبز"
                },
                "balance": {
                    "translation": "يوازن"
                },
                "balcony": {
                    "translation": "شرفة"
                },
                "ball": {
                    "translation": "كرة"
                },
                "banana": {
                    "translation": "موزة"
                },
                "bandage": {
                    "translation": "ضمادة"
                },
                "bank": {
                    "translation": "بنك / ضفة"
                },
                "bar": {
                    "translation": "حانة / قضيب"
                },
                "bark": {
                    "translation": "قشرة"
                },
                "barrier": {
                    "translation": "حاجز"
                },
                "base": {
                    "translation": "قاعدة / أساس"
                },
                "basis": {
                    "translation": "أساس"
                },
                "basket": {
                    "translation": "سلة"
                },
                "bathroom": {
                    "translation": "حمّام"
                },
                "battle": {
                    "translation": "معركة"
                },
                "be": {
                    "translation": "يكون"
                },
                "beach": {
                    "translation": "شاطئ"
                },
                "beak": {
                    "translation": "منقار"
                },
                "beard": {
                    "translation": "لحية"
                },
                "beat": {
                    "translation": "يهزم"
                },
                "beautiful": {
                    "translation": "جميل"
                },
                "because": {
                    "translation": "لأن"
                },
                "become": {
                    "translation": "يصبح"
                },
                "bed": {
                    "translation": "سرير"
                },
                "bedroom": {
                    "translation": "غرفة نوم"
                },
                "before": {
                    "translation": "قبل"
                },
                "begin": {
                    "translation": "يبدأ"
                },
                "beginning": {
                    "translation": "بداية"
                },
                "behavior": {
                    "translation": "سلوك"
                },
                "behind": {
                    "translation": "خلف"
                },
                "believe": {
                    "translation": "يؤمن"
                },
                "belong": {
                    "translation": "ينتمي"
                },
                "below": {
                    "translation": "تحت"
                },
                "belt": {
                    "translation": "حزام"
                },
                "bench": {
                    "translation": "مقعد"
                },
                "bend": {
                    "translation": "ينحنى"
                },
                "benefit": {
                    "translation": "فائدة / يستفيد"
                },
                "beside": {
                    "translation": "بجانب"
                },
                "besides": {
                    "translation": "إضافة إلى"
                },
                "best": {
                    "translation": "أفضل"
                },
                "better": {
                    "translation": "أفضل"
                },
                "between": {
                    "translation": "بين"
                },
                "beyond": {
                    "translation": "ما وراء"
                },
                "bicycle": {
                    "translation": "دراجة"
                },
                "big": {
                    "translation": "كبير"
                },
                "bike": {
                    "translation": "دراجة"
                },
                "bill": {
                    "translation": "فاتورة / مشروع قانون"
                },
                "billion": {
                    "translation": "مليار"
                },
                "bird": {
                    "translation": "طائر"
                },
                "bit": {
                    "translation": "قليل / بت"
                },
                "bitter": {
                    "translation": "مر"
                },
                "black": {
                    "translation": "أسود"
                },
                "blame": {
                    "translation": "يلوم"
                },
                "blanket": {
                    "translation": "بطانية"
                },
                "block": {
                    "translation": "كتلة"
                },
                "blood": {
                    "translation": "دم"
                },
                "blue": {
                    "translation": "أزرق"
                },
                "board": {
                    "translation": "لوحة / مجلس"
                },
                "boat": {
                    "translation": "قارب"
                },
                "boats": {
                    "translation": "قوارب"
                },
                "body": {
                    "translation": "جسم"
                },
                "boil": {
                    "translation": "يغلي"
                },
                "bone": {
                    "translation": "عظام"
                },
                "bonus": {
                    "translation": "مكافأة"
                },
                "book": {
                    "translation": "كتاب"
                },
                "boot": {
                    "translation": "حذاء طويل"
                },
                "bore": {
                    "translation": "يسئم"
                },
                "bored": {
                    "translation": "ضجران"
                },
                "borrow": {
                    "translation": "يستعير"
                },
                "boss": {
                    "translation": "موظف / رئيس"
                },
                "both": {
                    "translation": "كِلا"
                },
                "bother": {
                    "translation": "يزعج"
                },
                "bottle": {
                    "translation": "زجاجة"
                },
                "bottom": {
                    "translation": "قاع"
                },
                "bounce": {
                    "translation": "يرتد"
                },
                "bowl": {
                    "translation": "زبدية"
                },
                "box": {
                    "translation": "صندوق"
                },
                "boy": {
                    "translation": "ولد"
                },
                "brain": {
                    "translation": "مخ"
                },
                "branch": {
                    "translation": "غصن"
                },
                "brand": {
                    "translation": "علامة تجارية"
                },
                "brave": {
                    "translation": "شجاع"
                },
                "bread": {
                    "translation": "خبز"
                },
                "break": {
                    "translation": "يكسر / استراحة"
                },
                "breakfast": {
                    "translation": "فطور"
                },
                "breakthrough": {
                    "translation": "اختراق"
                },
                "bride": {
                    "translation": "عروس"
                },
                "bridge": {
                    "translation": "جسر"
                },
                "bright": {
                    "translation": "ساطع"
                },
                "bring": {
                    "translation": "يجلب"
                },
                "brother": {
                    "translation": "أخ"
                },
                "brought": {
                    "translation": "أحضر"
                },
                "brown": {
                    "translation": "بني"
                },
                "brush": {
                    "translation": "فرشاة"
                },
                "bucket": {
                    "translation": "دلو"
                },
                "build": {
                    "translation": "يبني"
                },
                "building": {
                    "translation": "مبنى"
                },
                "bunch": {
                    "translation": "عنقود"
                },
                "bundle": {
                    "translation": "حزمة"
                },
                "burn": {
                    "translation": "يحترق"
                },
                "bury": {
                    "translation": "يدفن"
                },
                "bus": {
                    "translation": "حافلة"
                },
                "bush": {
                    "translation": "شجيرة"
                },
                "business": {
                    "translation": "عمل / تجارة"
                },
                "busy": {
                    "translation": "مشغول"
                },
                "but": {
                    "translation": "لكن"
                },
                "butter": {
                    "translation": "زبدة"
                },
                "button": {
                    "translation": "زر"
                },
                "buy": {
                    "translation": "يشتري"
                },
                "buyer": {
                    "translation": "مشتري"
                },
                "by": {
                    "translation": "بواسطة"
                },
                "cabin": {
                    "translation": "كابينة"
                },
                "cabinet": {
                    "translation": "خزانة"
                },
                "cage": {
                    "translation": "قفص"
                },
                "calculate": {
                    "translation": "يحسب"
                },
                "calendar": {
                    "translation": "تقويم"
                },
                "call": {
                    "translation": "يتصل / ينادي"
                },
                "calm": {
                    "translation": "هادئ"
                },
                "came": {
                    "translation": "جاء"
                },
                "camera": {
                    "translation": "كاميرا"
                },
                "campaign": {
                    "translation": "حملة"
                },
                "can": {
                    "translation": "يستطيع"
                },
                "canal": {
                    "translation": "قناة"
                },
                "candidate": {
                    "translation": "مرشح"
                },
                "captain": {
                    "translation": "قبطان"
                },
                "car": {
                    "translation": "سيارة"
                },
                "carbon": {
                    "translation": "كربون"
                },
                "card": {
                    "translation": "بطاقة"
                },
                "care": {
                    "translation": "رعاية / يهتم"
                },
                "career": {
                    "translation": "مهنة"
                },
                "careful": {
                    "translation": "حذر"
                },
                "careless": {
                    "translation": "مهمل"
                },
                "carpenter": {
                    "translation": "نجّار"
                },
                "carpet": {
                    "translation": "سجادة"
                },
                "carriage": {
                    "translation": "عربة"
                },
                "carrot": {
                    "translation": "جزر"
                },
                "carry": {
                    "translation": "يحمل"
                },
                "case": {
                    "translation": "حالة / قضية"
                },
                "cashier": {
                    "translation": "أمين صندوق"
                },
                "casting": {
                    "translation": "يُلقي"
                },
                "cat": {
                    "translation": "قطة"
                },
                "catastrophe": {
                    "translation": "كارثة"
                },
                "catch": {
                    "translation": "يمسك / يصطاد"
                },
                "cattle": {
                    "translation": "ماشية"
                },
                "cause": {
                    "translation": "سبب / يتسبب"
                },
                "cave": {
                    "translation": "كهف"
                },
                "ceiling": {
                    "translation": "سقف"
                },
                "celebrate": {
                    "translation": "يحتفل"
                },
                "cell": {
                    "translation": "خلية / هاتف خلوي"
                },
                "census": {
                    "translation": "تعداد"
                },
                "center": {
                    "translation": "مركز"
                },
                "central": {
                    "translation": "مركزي"
                },
                "century": {
                    "translation": "قرن"
                },
                "certain": {
                    "translation": "مؤكد / معين"
                },
                "certainly": {
                    "translation": "بالتأكيد"
                },
                "certificate": {
                    "translation": "شهادة"
                },
                "chair": {
                    "translation": "كرسي / يرأس"
                },
                "challenge": {
                    "translation": "تحدي / يتحدى"
                },
                "chamber": {
                    "translation": "غرفة"
                },
                "champion": {
                    "translation": "بطل"
                },
                "chance": {
                    "translation": "فرصة"
                },
                "change": {
                    "translation": "يتغير / تغيير"
                },
                "chapter": {
                    "translation": "فصل"
                },
                "character": {
                    "translation": "شخصية / حرف"
                },
                "charge": {
                    "translation": "يشحن / يتهم / رسوم"
                },
                "charity": {
                    "translation": "إحسان"
                },
                "chase": {
                    "translation": "يطارد"
                },
                "cheap": {
                    "translation": "رخيص"
                },
                "check": {
                    "translation": "يفحص / شيك"
                },
                "checked": {
                    "translation": "فحص"
                },
                "cheese": {
                    "translation": "جبن"
                },
                "chest": {
                    "translation": "صدر"
                },
                "chicken": {
                    "translation": "دجاج"
                },
                "child": {
                    "translation": "طفل"
                },
                "childhood": {
                    "translation": "طفولة"
                },
                "children": {
                    "translation": "أطفال"
                },
                "choice": {
                    "translation": "اختيار"
                },
                "choose": {
                    "translation": "يختار"
                },
                "chop": {
                    "translation": "يفرّم"
                },
                "church": {
                    "translation": "كنيسة"
                },
                "circle": {
                    "translation": "دائرة"
                },
                "circumstance": {
                    "translation": "ظرف"
                },
                "city": {
                    "translation": "مدينة"
                },
                "claim": {
                    "translation": "مطالبة"
                },
                "clarify": {
                    "translation": "يوضّح"
                },
                "class": {
                    "translation": "فصل / طبقة"
                },
                "classify": {
                    "translation": "يصنف"
                },
                "clause": {
                    "translation": "بند"
                },
                "claw": {
                    "translation": "مخلب"
                },
                "clean": {
                    "translation": "ينظف"
                },
                "clear": {
                    "translation": "واضح / يزيل"
                },
                "clearly": {
                    "translation": "بوضوح"
                },
                "clerk": {
                    "translation": "موظف إداري"
                },
                "client": {
                    "translation": "عميل"
                },
                "cliff": {
                    "translation": "جرف"
                },
                "climate": {
                    "translation": "مناخ"
                },
                "climb": {
                    "translation": "يتسلق"
                },
                "cloak": {
                    "translation": "عباءة"
                },
                "clock": {
                    "translation": "ساعة حائط"
                },
                "close": {
                    "translation": "قريب"
                },
                "closed": {
                    "translation": "مغلق"
                },
                "cloth": {
                    "translation": "قماش"
                },
                "clothes": {
                    "translation": "ملابس"
                },
                "cloud": {
                    "translation": "سحابة"
                },
                "clue": {
                    "translation": "دليل"
                },
                "coach": {
                    "translation": "مدرب"
                },
                "coal": {
                    "translation": "فحم"
                },
                "coast": {
                    "translation": "ساحل"
                },
                "coat": {
                    "translation": "معطف"
                },
                "coffee": {
                    "translation": "قهوة"
                },
                "cold": {
                    "translation": "بارد"
                },
                "collapse": {
                    "translation": "ينهار"
                },
                "collar": {
                    "translation": "ياقة"
                },
                "collect": {
                    "translation": "يجمع"
                },
                "collection": {
                    "translation": "مجموعة"
                },
                "college": {
                    "translation": "كلية"
                },
                "colony": {
                    "translation": "مستعمرة"
                },
                "color": {
                    "translation": "لون"
                },
                "column": {
                    "translation": "عمود"
                },
                "comb": {
                    "translation": "مشط"
                },
                "combination": {
                    "translation": "تركيبة"
                },
                "combine": {
                    "translation": "يدمج"
                },
                "come": {
                    "translation": "يأتي"
                },
                "comfortable": {
                    "translation": "مريح"
                },
                "command": {
                    "translation": "يأمر"
                },
                "comment": {
                    "translation": "تعليق"
                },
                "committee": {
                    "translation": "لجنة"
                },
                "commodity": {
                    "translation": "سلعة"
                },
                "common": {
                    "translation": "شائع / مشترك"
                },
                "community": {
                    "translation": "مجتمع"
                },
                "company": {
                    "translation": "شركة"
                },
                "compare": {
                    "translation": "يقارن"
                },
                "comparison": {
                    "translation": "مقارنة"
                },
                "compete": {
                    "translation": "يتنافس"
                },
                "competition": {
                    "translation": "منافسة"
                },
                "complaint": {
                    "translation": "شكوى"
                },
                "complete": {
                    "translation": "يكمل"
                },
                "completing": {
                    "translation": "إكمال"
                },
                "compliment": {
                    "translation": "مجاملة"
                },
                "compromise": {
                    "translation": "يتسامح"
                },
                "compute": {
                    "translation": "يحسب"
                },
                "computer": {
                    "translation": "كمبيوتر"
                },
                "concentrate": {
                    "translation": "يركز"
                },
                "concept": {
                    "translation": "مفهوم"
                },
                "concern": {
                    "translation": "قلق / يهم"
                },
                "conclusion": {
                    "translation": "استنتاج"
                },
                "condition": {
                    "translation": "شرط / حالة"
                },
                "conference": {
                    "translation": "مؤتمر"
                },
                "confident": {
                    "translation": "واثق"
                },
                "confirm": {
                    "translation": "يؤكد"
                },
                "Congress": {
                    "translation": "كونغرس"
                },
                "connect": {
                    "translation": "يوصل"
                },
                "connection": {
                    "translation": "صلة"
                },
                "connections": {
                    "translation": "روابط"
                },
                "consequence": {
                    "translation": "عاقبة"
                },
                "consider": {
                    "translation": "يعتبر"
                },
                "consist": {
                    "translation": "يتألف"
                },
                "constitution": {
                    "translation": "دستور"
                },
                "construction": {
                    "translation": "بناء"
                },
                "consultant": {
                    "translation": "مستشار"
                },
                "contain": {
                    "translation": "يحتوي"
                },
                "contest": {
                    "translation": "مسابقة"
                },
                "continue": {
                    "translation": "يستمر"
                },
                "continued": {
                    "translation": "استمر"
                },
                "contract": {
                    "translation": "عقد"
                },
                "contrast": {
                    "translation": "يقارن"
                },
                "contribute": {
                    "translation": "يساهم"
                },
                "contribution": {
                    "translation": "مساهمة"
                },
                "control": {
                    "translation": "سيطرة / يتحكم"
                },
                "convention": {
                    "translation": "مؤتمر"
                },
                "conversation": {
                    "translation": "محادثة"
                },
                "conversations": {
                    "translation": "محادثات"
                },
                "conviction": {
                    "translation": "إدانة / قناعة"
                },
                "convince": {
                    "translation": "يقنع"
                },
                "cook": {
                    "translation": "يطبخ"
                },
                "cooking": {
                    "translation": "طبخ"
                },
                "cool": {
                    "translation": "بارد / معتدل"
                },
                "cooperate": {
                    "translation": "يتعاون"
                },
                "cope": {
                    "translation": "يتأقلم"
                },
                "corner": {
                    "translation": "زاوية"
                },
                "corridor": {
                    "translation": "ممر"
                },
                "cost": {
                    "translation": "تكلفة"
                },
                "costume": {
                    "translation": "زي"
                },
                "cottage": {
                    "translation": "كوخ"
                },
                "couch": {
                    "translation": "أريكة"
                },
                "could": {
                    "translation": "يمكن (ماضي can)"
                },
                "council": {
                    "translation": "مجلس"
                },
                "count": {
                    "translation": "يعد"
                },
                "country": {
                    "translation": "بلد"
                },
                "couple": {
                    "translation": "زوجين / اثنان"
                },
                "courage": {
                    "translation": "شجاعة"
                },
                "course": {
                    "translation": "مادة دراسية"
                },
                "court": {
                    "translation": "ملعب / محكمة"
                },
                "cousin": {
                    "translation": "ابن العم"
                },
                "cover": {
                    "translation": "يغطي / غطاء"
                },
                "coward": {
                    "translation": "جبان"
                },
                "craft": {
                    "translation": "مركب"
                },
                "crane": {
                    "translation": "رافعة"
                },
                "create": {
                    "translation": "يخلق"
                },
                "creating": {
                    "translation": "إنشاء"
                },
                "creation": {
                    "translation": "خلق"
                },
                "creature": {
                    "translation": "مخلوق"
                },
                "credit": {
                    "translation": "ائتمان"
                },
                "creek": {
                    "translation": "جدول صغير"
                },
                "crew": {
                    "translation": "طاقم"
                },
                "crime": {
                    "translation": "جريمة"
                },
                "crisp": {
                    "translation": "هش"
                },
                "criterion": {
                    "translation": "معيار"
                },
                "criticize": {
                    "translation": "ينتقد"
                },
                "crop": {
                    "translation": "محصول"
                },
                "crowd": {
                    "translation": "حشد"
                },
                "cruel": {
                    "translation": "قاسٍ"
                },
                "cry": {
                    "translation": "يبكي"
                },
                "cultural": {
                    "translation": "ثقافي"
                },
                "culture": {
                    "translation": "ثقافة"
                },
                "cup": {
                    "translation": "كوب"
                },
                "cure": {
                    "translation": "يشفي"
                },
                "curious": {
                    "translation": "فضولي"
                },
                "current": {
                    "translation": "حالي / تيار"
                },
                "currently": {
                    "translation": "حاليًا"
                },
                "customer": {
                    "translation": "زبون"
                },
                "cut": {
                    "translation": "يقطع"
                },
                "cycle": {
                    "translation": "دورة"
                },
                "dairy": {
                    "translation": "ألبان"
                },
                "dance": {
                    "translation": "يرقص"
                },
                "dancer": {
                    "translation": "راقص"
                },
                "dangerous": {
                    "translation": "خطير"
                },
                "daniel": {
                    "translation": "دانيال"
                },
                "dark": {
                    "translation": "مظلم"
                },
                "darkness": {
                    "translation": "ظلام"
                },
                "data": {
                    "translation": "بيانات"
                },
                "daughter": {
                    "translation": "ابنة"
                },
                "day": {
                    "translation": "يوم"
                },
                "dead": {
                    "translation": "ميت"
                },
                "deadline": {
                    "translation": "موعد نهائي"
                },
                "deal": {
                    "translation": "صفقة"
                },
                "death": {
                    "translation": "موت"
                },
                "debate": {
                    "translation": "يناظر"
                },
                "debt": {
                    "translation": "دين"
                },
                "decade": {
                    "translation": "عقد"
                },
                "december": {
                    "translation": "ديسمبر"
                },
                "deception": {
                    "translation": "خداع"
                },
                "decide": {
                    "translation": "يقرر"
                },
                "decided": {
                    "translation": "قرر"
                },
                "decision": {
                    "translation": "قرار"
                },
                "declaration": {
                    "translation": "إعلان"
                },
                "declare": {
                    "translation": "يعلن"
                },
                "decrease": {
                    "translation": "ينقص"
                },
                "deed": {
                    "translation": "فعل / عمل"
                },
                "deep": {
                    "translation": "عميق"
                },
                "deeply": {
                    "translation": "بعمق"
                },
                "default": {
                    "translation": "تقصير"
                },
                "defend": {
                    "translation": "يدافع"
                },
                "defense": {
                    "translation": "دفاع"
                },
                "deficit": {
                    "translation": "عجز"
                },
                "define": {
                    "translation": "يعرّف"
                },
                "degree": {
                    "translation": "درجة / شهادة"
                },
                "delicious": {
                    "translation": "شهي"
                },
                "delight": {
                    "translation": "بهجة"
                },
                "deliver": {
                    "translation": "يوصل"
                },
                "demand": {
                    "translation": "يطلب"
                },
                "democracy": {
                    "translation": "ديمقراطية"
                },
                "Democrat": {
                    "translation": "ديمقراطي"
                },
                "democratic": {
                    "translation": "ديمقراطي"
                },
                "demonstrate": {
                    "translation": "يبرهن"
                },
                "denote": {
                    "translation": "يدل على"
                },
                "dentist": {
                    "translation": "طبيب أسنان"
                },
                "depart": {
                    "translation": "يغادر"
                },
                "departure": {
                    "translation": "مغادرة"
                },
                "descend": {
                    "translation": "ينزل"
                },
                "describe": {
                    "translation": "يصف"
                },
                "description": {
                    "translation": "وصف"
                },
                "desert": {
                    "translation": "صحراء"
                },
                "deserve": {
                    "translation": "يستحق"
                },
                "design": {
                    "translation": "تصميم / يصمم"
                },
                "designer": {
                    "translation": "مصمم"
                },
                "desire": {
                    "translation": "يتوق"
                },
                "desk": {
                    "translation": "مكتب"
                },
                "despite": {
                    "translation": "رغم"
                },
                "destiny": {
                    "translation": "قدر"
                },
                "detail": {
                    "translation": "تفصيل"
                },
                "determine": {
                    "translation": "يحدد"
                },
                "develop": {
                    "translation": "يطور"
                },
                "development": {
                    "translation": "تطوير"
                },
                "device": {
                    "translation": "جهاز"
                },
                "dew": {
                    "translation": "ندى"
                },
                "diagnose": {
                    "translation": "يشخّص"
                },
                "die": {
                    "translation": "يموت"
                },
                "differ": {
                    "translation": "يختلف"
                },
                "difference": {
                    "translation": "فرق"
                },
                "different": {
                    "translation": "مختلف"
                },
                "differentiate": {
                    "translation": "يميز"
                },
                "difficult": {
                    "translation": "صعب"
                },
                "difficulty": {
                    "translation": "صعوبة"
                },
                "dilemma": {
                    "translation": "معضلة"
                },
                "dinner": {
                    "translation": "عشاء"
                },
                "diploma": {
                    "translation": "دبلوم"
                },
                "direct": {
                    "translation": "يوجّه"
                },
                "direction": {
                    "translation": "اتجاه"
                },
                "director": {
                    "translation": "مدير"
                },
                "dirty": {
                    "translation": "متسخ"
                },
                "disability": {
                    "translation": "إعاقة"
                },
                "disagreement": {
                    "translation": "خلاف"
                },
                "disappoint": {
                    "translation": "يخيب أمل"
                },
                "disaster": {
                    "translation": "كارثة"
                },
                "discipline": {
                    "translation": "انضباط"
                },
                "disconnect": {
                    "translation": "يفصل"
                },
                "disconnected": {
                    "translation": "منفصل"
                },
                "discourage": {
                    "translation": "ينفّر"
                },
                "discover": {
                    "translation": "يكتشف"
                },
                "discovery": {
                    "translation": "اكتشاف"
                },
                "discuss": {
                    "translation": "يناقش"
                },
                "disease": {
                    "translation": "مرض"
                },
                "dish": {
                    "translation": "طبق"
                },
                "display": {
                    "translation": "يعرض"
                },
                "distance": {
                    "translation": "مسافة"
                },
                "distinguish": {
                    "translation": "يميز"
                },
                "distract": {
                    "translation": "يشتت"
                },
                "district": {
                    "translation": "حي"
                },
                "disturb": {
                    "translation": "يزعج"
                },
                "dive": {
                    "translation": "يغوص"
                },
                "diverse": {
                    "translation": "متنوع"
                },
                "divide": {
                    "translation": "يقسم"
                },
                "division": {
                    "translation": "قسمة"
                },
                "do": {
                    "translation": "يفعل"
                },
                "doctor": {
                    "translation": "طبيب"
                },
                "document": {
                    "translation": "مستند"
                },
                "dog": {
                    "translation": "كلب"
                },
                "domain": {
                    "translation": "نطاق"
                },
                "donate": {
                    "translation": "يتبرع"
                },
                "donation": {
                    "translation": "تبرع"
                },
                "door": {
                    "translation": "باب"
                },
                "double": {
                    "translation": "مزدوج"
                },
                "doubt": {
                    "translation": "يشك"
                },
                "down": {
                    "translation": "أسفل"
                },
                "draft": {
                    "translation": "مسودة"
                },
                "drag": {
                    "translation": "يجرّ"
                },
                "drama": {
                    "translation": "دراما"
                },
                "draw": {
                    "translation": "يرسم / يسحب"
                },
                "drawing": {
                    "translation": "رسم"
                },
                "dream": {
                    "translation": "حلم / يحلم"
                },
                "dress": {
                    "translation": "فستان"
                },
                "dressing": {
                    "translation": "ضمادة"
                },
                "drift": {
                    "translation": "ينجرف"
                },
                "drive": {
                    "translation": "يقود / محرك"
                },
                "driver": {
                    "translation": "سائق"
                },
                "drop": {
                    "translation": "يسقط / نقطة"
                },
                "drought": {
                    "translation": "جفاف"
                },
                "drug": {
                    "translation": "دواء / مخدر"
                },
                "dry": {
                    "translation": "جاف"
                },
                "during": {
                    "translation": "أثناء / خلال"
                },
                "duty": {
                    "translation": "واجب"
                },
                "each": {
                    "translation": "كل"
                },
                "ear": {
                    "translation": "أذن"
                },
                "early": {
                    "translation": "مبكر"
                },
                "earn": {
                    "translation": "يكسب"
                },
                "earth": {
                    "translation": "أرض"
                },
                "easily": {
                    "translation": "بسهولة"
                },
                "east": {
                    "translation": "شرق"
                },
                "easy": {
                    "translation": "سهل"
                },
                "eat": {
                    "translation": "يأكل"
                },
                "echo": {
                    "translation": "يتردد صدى"
                },
                "economic": {
                    "translation": "اقتصادي"
                },
                "economy": {
                    "translation": "اقتصاد"
                },
                "edge": {
                    "translation": "حافة"
                },
                "editor": {
                    "translation": "محرر"
                },
                "education": {
                    "translation": "تعليم"
                },
                "effect": {
                    "translation": "تأثير"
                },
                "efficiency": {
                    "translation": "كفاءة"
                },
                "effort": {
                    "translation": "جهد"
                },
                "egg": {
                    "translation": "بيضة"
                },
                "eggs": {
                    "translation": "بيض"
                },
                "eight": {
                    "translation": "ثمانية"
                },
                "eighteen": {
                    "translation": "ثمانية عشر"
                },
                "eighty": {
                    "translation": "ثمانون"
                },
                "either": {
                    "translation": "أيضاً (في النفي) / إما"
                },
                "election": {
                    "translation": "انتخاب"
                },
                "electrician": {
                    "translation": "كهربائي"
                },
                "elegance": {
                    "translation": "أناقة"
                },
                "element": {
                    "translation": "عنصر"
                },
                "elevator": {
                    "translation": "مصعد"
                },
                "eleven": {
                    "translation": "أحد عشر"
                },
                "elite": {
                    "translation": "نخبة"
                },
                "else": {
                    "translation": "آخر"
                },
                "elsewhere": {
                    "translation": "في مكان آخر"
                },
                "emergency": {
                    "translation": "طوارئ"
                },
                "emotion": {
                    "translation": "عاطفة"
                },
                "emperor": {
                    "translation": "إمبراطور"
                },
                "empire": {
                    "translation": "إمبراطورية"
                },
                "employee": {
                    "translation": "موظف"
                },
                "employer": {
                    "translation": "صاحب عمل"
                },
                "empty": {
                    "translation": "يفرغ"
                },
                "encourage": {
                    "translation": "يشجع"
                },
                "end": {
                    "translation": "نهاية / ينتهي"
                },
                "endurance": {
                    "translation": "تحمّل"
                },
                "enemy": {
                    "translation": "عدو"
                },
                "energy": {
                    "translation": "طاقة"
                },
                "enforcement": {
                    "translation": "إنفاذ"
                },
                "engaged": {
                    "translation": "منخرط"
                },
                "engagement": {
                    "translation": "خطوبة"
                },
                "engine": {
                    "translation": "محرك"
                },
                "engineer": {
                    "translation": "مهندس"
                },
                "english": {
                    "translation": "الإنجليزية"
                },
                "enjoy": {
                    "translation": "يستمتع"
                },
                "enough": {
                    "translation": "كافٍ"
                },
                "enter": {
                    "translation": "يدخل"
                },
                "enterprise": {
                    "translation": "مشروع"
                },
                "entertainment": {
                    "translation": "ترفيه"
                },
                "enthusiasm": {
                    "translation": "حماس"
                },
                "entire": {
                    "translation": "كامل"
                },
                "entrance": {
                    "translation": "مدخل"
                },
                "entry": {
                    "translation": "مدخل"
                },
                "environment": {
                    "translation": "بيئة"
                },
                "environmental": {
                    "translation": "بيئي"
                },
                "episode": {
                    "translation": "حلقة"
                },
                "equity": {
                    "translation": "إنصاف"
                },
                "era": {
                    "translation": "عصر"
                },
                "error": {
                    "translation": "خطأ"
                },
                "escape": {
                    "translation": "يهرب"
                },
                "especially": {
                    "translation": "خاصة"
                },
                "essay": {
                    "translation": "مقالة"
                },
                "establish": {
                    "translation": "يؤسس"
                },
                "estate": {
                    "translation": "عقار"
                },
                "estimate": {
                    "translation": "يقدّر"
                },
                "evaluate": {
                    "translation": "يقيّم"
                },
                "even": {
                    "translation": "حتى / زوجي"
                },
                "evening": {
                    "translation": "مساء"
                },
                "event": {
                    "translation": "حدث"
                },
                "ever": {
                    "translation": "أبداً (في الاستفهام)"
                },
                "every": {
                    "translation": "كل"
                },
                "everybody": {
                    "translation": "الجميع"
                },
                "everyone": {
                    "translation": "الجميع"
                },
                "everything": {
                    "translation": "كل شيء"
                },
                "everywhere": {
                    "translation": "كل مكان"
                },
                "evidence": {
                    "translation": "دليل"
                },
                "exactly": {
                    "translation": "تماماً"
                },
                "exam": {
                    "translation": "امتحان"
                },
                "examine": {
                    "translation": "يفحص"
                },
                "example": {
                    "translation": "مثال"
                },
                "except": {
                    "translation": "ما عدا"
                },
                "exception": {
                    "translation": "استثناء"
                },
                "exchange": {
                    "translation": "يتبادل"
                },
                "excited": {
                    "translation": "متحمس"
                },
                "excitement": {
                    "translation": "إثارة"
                },
                "exclude": {
                    "translation": "يستثني"
                },
                "execution": {
                    "translation": "تنفيذ"
                },
                "executive": {
                    "translation": "تنفيذي"
                },
                "exercise": {
                    "translation": "يتمرن"
                },
                "exhibit": {
                    "translation": "يعرض"
                },
                "exist": {
                    "translation": "يوجد"
                },
                "exit": {
                    "translation": "مخرج"
                },
                "expand": {
                    "translation": "يتوسع"
                },
                "expanding": {
                    "translation": "توسع"
                },
                "expect": {
                    "translation": "يتوقع"
                },
                "expectation": {
                    "translation": "توقع"
                },
                "expense": {
                    "translation": "نفقة"
                },
                "expensive": {
                    "translation": "غالٍ"
                },
                "experience": {
                    "translation": "خبرة / يجرب"
                },
                "experiment": {
                    "translation": "تجربة"
                },
                "expert": {
                    "translation": "خبير"
                },
                "explain": {
                    "translation": "يشرح"
                },
                "explanation": {
                    "translation": "تفسير"
                },
                "explode": {
                    "translation": "ينفجر"
                },
                "exploration": {
                    "translation": "استكشاف"
                },
                "explore": {
                    "translation": "يستكشف"
                },
                "export": {
                    "translation": "تصدير"
                },
                "express": {
                    "translation": "يعبر"
                },
                "expression": {
                    "translation": "تعبير"
                },
                "extension": {
                    "translation": "امتداد"
                },
                "extent": {
                    "translation": "نطاق"
                },
                "extinguish": {
                    "translation": "يطفئ"
                },
                "eye": {
                    "translation": "عين"
                },
                "eyebrow": {
                    "translation": "حاجب"
                },
                "fabric": {
                    "translation": "قماش"
                },
                "face": {
                    "translation": "وجه"
                },
                "facility": {
                    "translation": "منشأة"
                },
                "fact": {
                    "translation": "حقيقة"
                },
                "factor": {
                    "translation": "عامل"
                },
                "fail": {
                    "translation": "يفشل"
                },
                "failure": {
                    "translation": "فشل"
                },
                "fair": {
                    "translation": "عادل"
                },
                "fall": {
                    "translation": "يسقط / خريف"
                },
                "false": {
                    "translation": "زائف"
                },
                "fame": {
                    "translation": "شهرة"
                },
                "family": {
                    "translation": "عائلة"
                },
                "famous": {
                    "translation": "مشهور"
                },
                "far": {
                    "translation": "بعيد"
                },
                "fare": {
                    "translation": "أجرة"
                },
                "farm": {
                    "translation": "مزرعة"
                },
                "farmer": {
                    "translation": "مزارع"
                },
                "fashion": {
                    "translation": "موضة"
                },
                "fast": {
                    "translation": "سريع"
                },
                "fate": {
                    "translation": "مصير"
                },
                "father": {
                    "translation": "أب"
                },
                "fault": {
                    "translation": "خطأ"
                },
                "fear": {
                    "translation": "خوف / يخاف"
                },
                "feather": {
                    "translation": "ريشة"
                },
                "feature": {
                    "translation": "سمة"
                },
                "february": {
                    "translation": "فبراير"
                },
                "federal": {
                    "translation": "اتحادي"
                },
                "feel": {
                    "translation": "يشعر"
                },
                "feeling": {
                    "translation": "شعور"
                },
                "felt": {
                    "translation": "شعر"
                },
                "female": {
                    "translation": "أنثى"
                },
                "fence": {
                    "translation": "سياج"
                },
                "festive": {
                    "translation": "احتفالي"
                },
                "few": {
                    "translation": "قليل"
                },
                "fiction": {
                    "translation": "خيال"
                },
                "field": {
                    "translation": "حقل / مجال"
                },
                "fifteen": {
                    "translation": "خمسة عشر"
                },
                "fifty": {
                    "translation": "خمسون"
                },
                "fight": {
                    "translation": "قتال / يقاتل"
                },
                "figure": {
                    "translation": "شكل / شخصية"
                },
                "fill": {
                    "translation": "يملأ"
                },
                "filled": {
                    "translation": "مملوء"
                },
                "film": {
                    "translation": "فيلم"
                },
                "final": {
                    "translation": "نهائي"
                },
                "finally": {
                    "translation": "أخيراً"
                },
                "financial": {
                    "translation": "مالي"
                },
                "find": {
                    "translation": "يجد"
                },
                "fine": {
                    "translation": "غرامة / جيد"
                },
                "finger": {
                    "translation": "إصبع"
                },
                "finish": {
                    "translation": "ينهي"
                },
                "finished": {
                    "translation": "أنهى"
                },
                "fire": {
                    "translation": "نار / يطرد"
                },
                "firm": {
                    "translation": "شركة / صارم"
                },
                "first": {
                    "translation": "أول"
                },
                "fish": {
                    "translation": "سمك / يصطاد"
                },
                "fisherman": {
                    "translation": "صياد سمك"
                },
                "fishermen": {
                    "translation": "صيادون"
                },
                "fit": {
                    "translation": "يناسب"
                },
                "five": {
                    "translation": "خمسة"
                },
                "fix": {
                    "translation": "يصلح"
                },
                "flashlight": {
                    "translation": "مصباح يدوي"
                },
                "flight": {
                    "translation": "رحلة جوية"
                },
                "float": {
                    "translation": "يطفو"
                },
                "flood": {
                    "translation": "فيضان"
                },
                "floor": {
                    "translation": "أرضية / دور"
                },
                "flour": {
                    "translation": "طحين"
                },
                "flow": {
                    "translation": "يتدفق"
                },
                "flower": {
                    "translation": "زهرة"
                },
                "fly": {
                    "translation": "يطير / ذبابة"
                },
                "focus": {
                    "translation": "تركيز / يركز"
                },
                "fog": {
                    "translation": "ضباب"
                },
                "follow": {
                    "translation": "يتبع"
                },
                "following": {
                    "translation": "التالي"
                },
                "food": {
                    "translation": "طعام"
                },
                "foot": {
                    "translation": "قدم"
                },
                "for": {
                    "translation": "من أجل"
                },
                "forbid": {
                    "translation": "يمنع"
                },
                "force": {
                    "translation": "قوة / يجبر"
                },
                "forecast": {
                    "translation": "توقع"
                },
                "foreign": {
                    "translation": "أجنبي"
                },
                "forest": {
                    "translation": "غابة"
                },
                "forget": {
                    "translation": "ينسى"
                },
                "forgive": {
                    "translation": "يسامح"
                },
                "fork": {
                    "translation": "شوكة"
                },
                "form": {
                    "translation": "استمارة / شكل"
                },
                "former": {
                    "translation": "سابق"
                },
                "fortune": {
                    "translation": "ثروة"
                },
                "forty": {
                    "translation": "أربعون"
                },
                "forty-five": {
                    "translation": "خمسة وأربعون"
                },
                "forward": {
                    "translation": "إلى الأمام"
                },
                "foundation": {
                    "translation": "مؤسسة"
                },
                "four": {
                    "translation": "أربعة"
                },
                "fourteen": {
                    "translation": "أربعة عشر"
                },
                "framework": {
                    "translation": "إطار"
                },
                "fraud": {
                    "translation": "احتيال"
                },
                "free": {
                    "translation": "حر / مجاني"
                },
                "freeze": {
                    "translation": "يجمّد"
                },
                "frequency": {
                    "translation": "تردد"
                },
                "fresh": {
                    "translation": "طازج"
                },
                "friday": {
                    "translation": "الجمعة"
                },
                "friend": {
                    "translation": "صديق"
                },
                "friendly": {
                    "translation": "ودود"
                },
                "friends": {
                    "translation": "اصدقاء"
                },
                "friendship": {
                    "translation": "صداقة"
                },
                "frighten": {
                    "translation": "يخيف"
                },
                "from": {
                    "translation": "من"
                },
                "front": {
                    "translation": "أمام"
                },
                "frontier": {
                    "translation": "حدود"
                },
                "fruit": {
                    "translation": "فاكهة"
                },
                "fry": {
                    "translation": "يقلي"
                },
                "full": {
                    "translation": "ممتلئ / كامل"
                },
                "fund": {
                    "translation": "صندوق / يمول"
                },
                "funeral": {
                    "translation": "جنازة"
                },
                "fur": {
                    "translation": "فرو"
                },
                "furniture": {
                    "translation": "أثاث"
                },
                "furthermore": {
                    "translation": "فضلاً عن ذلك"
                },
                "future": {
                    "translation": "مستقبل"
                },
                "galaxy": {
                    "translation": "مجرة"
                },
                "gallery": {
                    "translation": "معرض"
                },
                "game": {
                    "translation": "لعبة"
                },
                "garage": {
                    "translation": "مرآب"
                },
                "garbage": {
                    "translation": "قمامة"
                },
                "garden": {
                    "translation": "حديقة"
                },
                "gardener": {
                    "translation": "بستاني"
                },
                "garlic": {
                    "translation": "ثوم"
                },
                "gate": {
                    "translation": "بوابة"
                },
                "gather": {
                    "translation": "يجمع"
                },
                "gear": {
                    "translation": "معدات"
                },
                "gene": {
                    "translation": "جين"
                },
                "general": {
                    "translation": "عام"
                },
                "generally": {
                    "translation": "بشكل عام"
                },
                "genius": {
                    "translation": "عبقرية"
                },
                "get": {
                    "translation": "يحصل"
                },
                "gift": {
                    "translation": "هدية"
                },
                "girl": {
                    "translation": "فتاة"
                },
                "give": {
                    "translation": "يعطي"
                },
                "glacier": {
                    "translation": "نهر جليدي"
                },
                "glad": {
                    "translation": "مسرور"
                },
                "glass": {
                    "translation": "زجاج / كأس"
                },
                "glasses": {
                    "translation": "نظارة"
                },
                "gloom": {
                    "translation": "كآبة"
                },
                "glove": {
                    "translation": "قفاز"
                },
                "go": {
                    "translation": "يذهب"
                },
                "goal": {
                    "translation": "هدف"
                },
                "gold": {
                    "translation": "ذهبي"
                },
                "golf": {
                    "translation": "غولف"
                },
                "good": {
                    "translation": "جيد"
                },
                "government": {
                    "translation": "حكومة"
                },
                "gown": {
                    "translation": "ثوب"
                },
                "grab": {
                    "translation": "يخطف"
                },
                "grandfather": {
                    "translation": "جد"
                },
                "grandmother": {
                    "translation": "جدة"
                },
                "grant": {
                    "translation": "منحة"
                },
                "grape": {
                    "translation": "عنب"
                },
                "graph": {
                    "translation": "رسم بياني"
                },
                "grass": {
                    "translation": "عشب"
                },
                "grate": {
                    "translation": "يبشر"
                },
                "gratitude": {
                    "translation": "امتنان"
                },
                "gray": {
                    "translation": "رمادي"
                },
                "great": {
                    "translation": "عظيم"
                },
                "green": {
                    "translation": "أخضر"
                },
                "greet": {
                    "translation": "يحيي"
                },
                "grief": {
                    "translation": "حزن"
                },
                "grill": {
                    "translation": "يشوي"
                },
                "ground": {
                    "translation": "أرض"
                },
                "group": {
                    "translation": "مجموعة"
                },
                "grow": {
                    "translation": "ينمو"
                },
                "growth": {
                    "translation": "نمو"
                },
                "guard": {
                    "translation": "يحرس"
                },
                "guess": {
                    "translation": "يخمن"
                },
                "guest": {
                    "translation": "ضيف"
                },
                "guidance": {
                    "translation": "إرشاد"
                },
                "guide": {
                    "translation": "يرشد"
                },
                "guil": {
                    "translation": "ذنب"
                },
                "guitar": {
                    "translation": "غيتار"
                },
                "gun": {
                    "translation": "مسدس"
                },
                "guy": {
                    "translation": "شاب"
                },
                "habit": {
                    "translation": "عادة"
                },
                "hair": {
                    "translation": "شعر"
                },
                "half": {
                    "translation": "نصف"
                },
                "halfway": {
                    "translation": "منتصف الطريق"
                },
                "hallway": {
                    "translation": "ردهة"
                },
                "hammer": {
                    "translation": "مطرقة"
                },
                "hand": {
                    "translation": "يد"
                },
                "handle": {
                    "translation": "يتعامل مع"
                },
                "hang": {
                    "translation": "يعلق / يشنق"
                },
                "happen": {
                    "translation": "يحدث"
                },
                "happier": {
                    "translation": "أكثر سعادة"
                },
                "happy": {
                    "translation": "سعيد"
                },
                "harbor": {
                    "translation": "ميناء"
                },
                "hard": {
                    "translation": "صعب / بقوة"
                },
                "hardly": {
                    "translation": "بالكاد"
                },
                "harmony": {
                    "translation": "تناغم"
                },
                "harvest": {
                    "translation": "حصاد"
                },
                "hat": {
                    "translation": "قبعة"
                },
                "hate": {
                    "translation": "يكره"
                },
                "have": {
                    "translation": "يملك / لديه"
                },
                "haven": {
                    "translation": "ملاذ"
                },
                "he": {
                    "translation": "هو"
                },
                "head": {
                    "translation": "رأس"
                },
                "headquarters": {
                    "translation": "مقر رئيسي"
                },
                "heal": {
                    "translation": "يشفي"
                },
                "health": {
                    "translation": "صحة"
                },
                "heap": {
                    "translation": "كومة"
                },
                "hear": {
                    "translation": "يسمع"
                },
                "heart": {
                    "translation": "قلب"
                },
                "heat": {
                    "translation": "حرارة"
                },
                "heaven": {
                    "translation": "جنة"
                },
                "heavy": {
                    "translation": "ثقيل"
                },
                "heel": {
                    "translation": "كعب"
                },
                "height": {
                    "translation": "ارتفاع"
                },
                "hello": {
                    "translation": "مرحباً"
                },
                "help": {
                    "translation": "يساعد"
                },
                "helped": {
                    "translation": "ساعد"
                },
                "hence": {
                    "translation": "من هنا"
                },
                "her": {
                    "translation": "لها / هي (مفعول)"
                },
                "herb": {
                    "translation": "عشبة"
                },
                "here": {
                    "translation": "هنا"
                },
                "heritage": {
                    "translation": "تراث"
                },
                "hero": {
                    "translation": "بطل"
                },
                "hers": {
                    "translation": "خاصتها"
                },
                "herself": {
                    "translation": "نفسها"
                },
                "hide": {
                    "translation": "يخفي"
                },
                "hierarchy": {
                    "translation": "تسلسل هرمي"
                },
                "high": {
                    "translation": "عالي"
                },
                "hill": {
                    "translation": "تل"
                },
                "him": {
                    "translation": "هو (مفعول)"
                },
                "himself": {
                    "translation": "نفسه"
                },
                "hint": {
                    "translation": "تلميح"
                },
                "his": {
                    "translation": "له"
                },
                "history": {
                    "translation": "تاريخ"
                },
                "hit": {
                    "translation": "يضرب / نجاح"
                },
                "hobby": {
                    "translation": "هواية"
                },
                "hold": {
                    "translation": "يمسك"
                },
                "hollow": {
                    "translation": "مجوف"
                },
                "home": {
                    "translation": "منزل"
                },
                "homemade": {
                    "translation": "منزلي الصنع"
                },
                "honest": {
                    "translation": "صادق"
                },
                "honey": {
                    "translation": "عسل"
                },
                "honor": {
                    "translation": "شرف"
                },
                "hoof": {
                    "translation": "حافر"
                },
                "hope": {
                    "translation": "أمل / يأمل"
                },
                "horizon": {
                    "translation": "أفق"
                },
                "hormone": {
                    "translation": "هرمون"
                },
                "horn": {
                    "translation": "قرن"
                },
                "horror": {
                    "translation": "رعب"
                },
                "horse": {
                    "translation": "حصان"
                },
                "hospital": {
                    "translation": "مستشفى"
                },
                "hospitality": {
                    "translation": "ضيافة"
                },
                "host": {
                    "translation": "مضيف"
                },
                "hot": {
                    "translation": "ساخن"
                },
                "hotel": {
                    "translation": "فندق"
                },
                "hour": {
                    "translation": "ساعة"
                },
                "house": {
                    "translation": "منزل"
                },
                "household": {
                    "translation": "أسرة"
                },
                "how": {
                    "translation": "كيف"
                },
                "however": {
                    "translation": "لكن / مع ذلك"
                },
                "hug": {
                    "translation": "يعانق"
                },
                "huge": {
                    "translation": "ضخم"
                },
                "human": {
                    "translation": "إنسان"
                },
                "humidity": {
                    "translation": "رطوبة"
                },
                "hundred": {
                    "translation": "مائة"
                },
                "hungry": {
                    "translation": "جائع"
                },
                "hunter": {
                    "translation": "صياد"
                },
                "hurricane": {
                    "translation": "إعصار"
                },
                "hurt": {
                    "translation": "يؤلم"
                },
                "husband": {
                    "translation": "زوج"
                },
                "hypothesis": {
                    "translation": "فرضية"
                },
                "I": {
                    "translation": "أنا"
                },
                "i": {
                    "translation": "أنا"
                },
                "icon": {
                    "translation": "أيقونة"
                },
                "idea": {
                    "translation": "فكرة"
                },
                "ideal": {
                    "translation": "مثالي"
                },
                "identical": {
                    "translation": "مطابق"
                },
                "identify": {
                    "translation": "يحدد"
                },
                "identity": {
                    "translation": "هوية"
                },
                "ideology": {
                    "translation": "أيديولوجية"
                },
                "if": {
                    "translation": "إذا"
                },
                "ignite": {
                    "translation": "يشعل"
                },
                "illness": {
                    "translation": "مرض"
                },
                "illustrate": {
                    "translation": "يوضّح"
                },
                "image": {
                    "translation": "صورة"
                },
                "imagination": {
                    "translation": "خيال"
                },
                "imagine": {
                    "translation": "يتخيل"
                },
                "immediate": {
                    "translation": "فوري"
                },
                "immediately": {
                    "translation": "فورًا"
                },
                "impact": {
                    "translation": "تأثير"
                },
                "imply": {
                    "translation": "يلمح"
                },
                "importance": {
                    "translation": "أهمية"
                },
                "important": {
                    "translation": "مهم"
                },
                "impossible": {
                    "translation": "مستحيل"
                },
                "improve": {
                    "translation": "يحسن"
                },
                "in": {
                    "translation": "في"
                },
                "incentive": {
                    "translation": "حافز"
                },
                "incident": {
                    "translation": "حادث"
                },
                "include": {
                    "translation": "يشمل"
                },
                "included": {
                    "translation": "تضمن"
                },
                "including": {
                    "translation": "بما في ذلك"
                },
                "increase": {
                    "translation": "زيادة / يزيد"
                },
                "indeed": {
                    "translation": "في الواقع"
                },
                "independence": {
                    "translation": "استقلال"
                },
                "index": {
                    "translation": "فهرس"
                },
                "indicate": {
                    "translation": "يشير"
                },
                "indication": {
                    "translation": "دليل"
                },
                "individual": {
                    "translation": "فردي"
                },
                "industry": {
                    "translation": "صناعة"
                },
                "infection": {
                    "translation": "عدوى"
                },
                "inflation": {
                    "translation": "تضخم"
                },
                "influence": {
                    "translation": "تأثير"
                },
                "information": {
                    "translation": "معلومات"
                },
                "ingredient": {
                    "translation": "مكوّن"
                },
                "inhabitant": {
                    "translation": "ساكن"
                },
                "inheritance": {
                    "translation": "إرث"
                },
                "initiative": {
                    "translation": "مبادرة"
                },
                "injury": {
                    "translation": "إصابة"
                },
                "innovation": {
                    "translation": "ابتكار"
                },
                "input": {
                    "translation": "إدخال"
                },
                "inquiry": {
                    "translation": "استفسار"
                },
                "inside": {
                    "translation": "داخل"
                },
                "insight": {
                    "translation": "بصيرة"
                },
                "inspect": {
                    "translation": "يتفقّد"
                },
                "inspire": {
                    "translation": "يلهم"
                },
                "install": {
                    "translation": "يثبّت"
                },
                "instance": {
                    "translation": "مثال"
                },
                "instead": {
                    "translation": "بدلاً من"
                },
                "institute": {
                    "translation": "معهد"
                },
                "institution": {
                    "translation": "مؤسسة"
                },
                "instruct": {
                    "translation": "يوجّه"
                },
                "instruction": {
                    "translation": "تعليمات"
                },
                "insurance": {
                    "translation": "تأمين"
                },
                "intelligence": {
                    "translation": "ذكاء"
                },
                "intend": {
                    "translation": "ينوي"
                },
                "intention": {
                    "translation": "نية"
                },
                "interaction": {
                    "translation": "تفاعل"
                },
                "interest": {
                    "translation": "فائدة / اهتمام"
                },
                "international": {
                    "translation": "دولي"
                },
                "internet": {
                    "translation": "إنترنت"
                },
                "intervention": {
                    "translation": "تدخل"
                },
                "interview": {
                    "translation": "مقابلة / يجري مقابلة"
                },
                "into": {
                    "translation": "إلى داخل"
                },
                "introduce": {
                    "translation": "يُعرِّف"
                },
                "introduction": {
                    "translation": "مقدمة"
                },
                "invasion": {
                    "translation": "غزو"
                },
                "invent": {
                    "translation": "يخترع"
                },
                "investigate": {
                    "translation": "يحقق"
                },
                "investment": {
                    "translation": "استثمار"
                },
                "invitation": {
                    "translation": "دعوة"
                },
                "invite": {
                    "translation": "يدعو"
                },
                "invited": {
                    "translation": "دعا"
                },
                "involve": {
                    "translation": "يتضمن"
                },
                "island": {
                    "translation": "جزيرة"
                },
                "isolated": {
                    "translation": "معزول"
                },
                "issue": {
                    "translation": "قضية / عدد"
                },
                "it": {
                    "translation": "هو / هي (لغير العاقل)"
                },
                "item": {
                    "translation": "بند"
                },
                "its": {
                    "translation": "له / لها (لغير العاقل)"
                },
                "itself": {
                    "translation": "نفسه (لغير العاقل)"
                },
                "jail": {
                    "translation": "سجن"
                },
                "jam": {
                    "translation": "مربى"
                },
                "january": {
                    "translation": "يناير"
                },
                "jar": {
                    "translation": "برطمان"
                },
                "jazz": {
                    "translation": "جاز"
                },
                "jewel": {
                    "translation": "جوهرة"
                },
                "job": {
                    "translation": "وظيفة"
                },
                "join": {
                    "translation": "ينضم"
                },
                "joint": {
                    "translation": "مفصل"
                },
                "journal": {
                    "translation": "مجلة"
                },
                "journalist": {
                    "translation": "صحفي"
                },
                "journey": {
                    "translation": "رحلة"
                },
                "joy": {
                    "translation": "فرح"
                },
                "judge": {
                    "translation": "يحكم"
                },
                "juice": {
                    "translation": "عصير"
                },
                "july": {
                    "translation": "يوليو"
                },
                "junction": {
                    "translation": "تقاطع"
                },
                "june": {
                    "translation": "يونيو"
                },
                "jurisdiction": {
                    "translation": "اختصاص قضائي"
                },
                "just": {
                    "translation": "فقط / للتو"
                },
                "justice": {
                    "translation": "عدالة"
                },
                "keep": {
                    "translation": "يحافظ / يبقي"
                },
                "kernel": {
                    "translation": "نواة"
                },
                "kettle": {
                    "translation": "غلاية"
                },
                "key": {
                    "translation": "مفتاح"
                },
                "keyboard": {
                    "translation": "لوحة مفاتيح"
                },
                "kick": {
                    "translation": "يركل"
                },
                "kid": {
                    "translation": "طفل"
                },
                "kidney": {
                    "translation": "كلية"
                },
                "kill": {
                    "translation": "يقتل"
                },
                "kind": {
                    "translation": "نوع / لطيف"
                },
                "kindness": {
                    "translation": "لطف"
                },
                "kingdom": {
                    "translation": "مملكة"
                },
                "kiss": {
                    "translation": "يقبّل"
                },
                "kitchen": {
                    "translation": "مطبخ"
                },
                "knee": {
                    "translation": "ركبة"
                },
                "knife": {
                    "translation": "سكين"
                },
                "knock": {
                    "translation": "يطرق"
                },
                "know": {
                    "translation": "يعرف"
                },
                "knowing": {
                    "translation": "معرفة"
                },
                "knowledge": {
                    "translation": "معرفة"
                },
                "label": {
                    "translation": "يسمّي"
                },
                "labor": {
                    "translation": "عمل"
                },
                "laboratory": {
                    "translation": "مختبر"
                },
                "laborer": {
                    "translation": "عامل يدوي"
                },
                "lack": {
                    "translation": "نقص"
                },
                "ladder": {
                    "translation": "سلم"
                },
                "lake": {
                    "translation": "بحيرة"
                },
                "lamp": {
                    "translation": "مصباح"
                },
                "land": {
                    "translation": "أرض / يهبط"
                },
                "landscape": {
                    "translation": "منظر طبيعي"
                },
                "language": {
                    "translation": "لغة"
                },
                "laptop": {
                    "translation": "حاسوب محمول"
                },
                "large": {
                    "translation": "كبير"
                },
                "last": {
                    "translation": "الأخير"
                },
                "late": {
                    "translation": "متأخر"
                },
                "later": {
                    "translation": "لاحقاً"
                },
                "laugh": {
                    "translation": "يضحك"
                },
                "laughed": {
                    "translation": "ضحك"
                },
                "laughter": {
                    "translation": "ضحك"
                },
                "launch": {
                    "translation": "يشغّل"
                },
                "law": {
                    "translation": "قانون"
                },
                "lawyer": {
                    "translation": "محامي"
                },
                "lay": {
                    "translation": "يضع / يستلقي"
                },
                "lazy": {
                    "translation": "كسول"
                },
                "lead": {
                    "translation": "يقود / رصاص"
                },
                "leader": {
                    "translation": "قائد"
                },
                "leaf": {
                    "translation": "ورقة"
                },
                "league": {
                    "translation": "دوري"
                },
                "leak": {
                    "translation": "يتسرّب"
                },
                "learn": {
                    "translation": "يتعلم"
                },
                "learning": {
                    "translation": "تعلم"
                },
                "leash": {
                    "translation": "مقود"
                },
                "least": {
                    "translation": "الأقل"
                },
                "leather": {
                    "translation": "جلد"
                },
                "leave": {
                    "translation": "يغادر"
                },
                "lecture": {
                    "translation": "محاضرة"
                },
                "left": {
                    "translation": "يسار / غادر"
                },
                "leg": {
                    "translation": "ساق"
                },
                "legacy": {
                    "translation": "إرث"
                },
                "legal": {
                    "translation": "قانوني"
                },
                "legend": {
                    "translation": "أسطورة"
                },
                "leisure": {
                    "translation": "فراغ"
                },
                "lend": {
                    "translation": "يُقرض"
                },
                "length": {
                    "translation": "طول"
                },
                "lens": {
                    "translation": "عدسة"
                },
                "less": {
                    "translation": "أقل"
                },
                "lesson": {
                    "translation": "درس"
                },
                "let": {
                    "translation": "يدع / يسمح"
                },
                "letter": {
                    "translation": "رسالة / حرف"
                },
                "level": {
                    "translation": "مستوى"
                },
                "liability": {
                    "translation": "مسؤولية"
                },
                "liberty": {
                    "translation": "حرية"
                },
                "library": {
                    "translation": "مكتبة"
                },
                "license": {
                    "translation": "ترخيص"
                },
                "lie": {
                    "translation": "يكذب / يستلقي"
                },
                "life": {
                    "translation": "حياة"
                },
                "lift": {
                    "translation": "يرفع"
                },
                "light": {
                    "translation": "ضوء / خفيف"
                },
                "lightning": {
                    "translation": "برق"
                },
                "like": {
                    "translation": "مثل / يحب"
                },
                "likely": {
                    "translation": "محتمل"
                },
                "limit": {
                    "translation": "حد"
                },
                "line": {
                    "translation": "خط"
                },
                "link": {
                    "translation": "رابط"
                },
                "liquid": {
                    "translation": "سائل"
                },
                "list": {
                    "translation": "قائمة / يسرد"
                },
                "listen": {
                    "translation": "يستمع"
                },
                "listened": {
                    "translation": "استمع"
                },
                "literacy": {
                    "translation": "إلمام بالقراءة"
                },
                "literature": {
                    "translation": "أدب"
                },
                "little": {
                    "translation": "قليل / صغير"
                },
                "live": {
                    "translation": "يعيش / مباشر"
                },
                "lived": {
                    "translation": "عاش"
                },
                "liver": {
                    "translation": "كبد"
                },
                "lobby": {
                    "translation": "ردهة"
                },
                "local": {
                    "translation": "محلي"
                },
                "location": {
                    "translation": "موقع"
                },
                "locker": {
                    "translation": "خزانة"
                },
                "logic": {
                    "translation": "منطق"
                },
                "logo": {
                    "translation": "شعار"
                },
                "lonely": {
                    "translation": "وحيد"
                },
                "long": {
                    "translation": "طويل"
                },
                "look": {
                    "translation": "ينظر"
                },
                "looked": {
                    "translation": "نظر"
                },
                "lose": {
                    "translation": "يخسر"
                },
                "loser": {
                    "translation": "الخاسر"
                },
                "loss": {
                    "translation": "خسارة"
                },
                "lot": {
                    "translation": "الكثير"
                },
                "lotion": {
                    "translation": "مرطب"
                },
                "loud": {
                    "translation": "صاخب"
                },
                "love": {
                    "translation": "حب"
                },
                "low": {
                    "translation": "منخفض"
                },
                "lower": {
                    "translation": "يخفض"
                },
                "loyalty": {
                    "translation": "ولاء"
                },
                "luck": {
                    "translation": "حظ"
                },
                "luggage": {
                    "translation": "أمتعة"
                },
                "lunch": {
                    "translation": "غداء"
                },
                "luxury": {
                    "translation": "فخامة"
                },
                "machine": {
                    "translation": "آلة"
                },
                "made": {
                    "translation": "صنع"
                },
                "magazine": {
                    "translation": "مجلة"
                },
                "magic": {
                    "translation": "سحر"
                },
                "magnitude": {
                    "translation": "ضخامة"
                },
                "maid": {
                    "translation": "خادمة"
                },
                "main": {
                    "translation": "رئيسي"
                },
                "maintain": {
                    "translation": "يحافظ"
                },
                "major": {
                    "translation": "رئيسي / تخصص"
                },
                "majority": {
                    "translation": "أغلبية"
                },
                "make": {
                    "translation": "يصنع"
                },
                "mall": {
                    "translation": "مول"
                },
                "man": {
                    "translation": "رجل"
                },
                "manage": {
                    "translation": "يدير"
                },
                "management": {
                    "translation": "إدارة"
                },
                "manager": {
                    "translation": "مدير"
                },
                "mandate": {
                    "translation": "تفويض"
                },
                "mansion": {
                    "translation": "قصر"
                },
                "many": {
                    "translation": "كثير"
                },
                "march": {
                    "translation": "مارس"
                },
                "margin": {
                    "translation": "هامش"
                },
                "market": {
                    "translation": "سوق"
                },
                "marriage": {
                    "translation": "زواج"
                },
                "marry": {
                    "translation": "يتزوج"
                },
                "mash": {
                    "translation": "يدق"
                },
                "mason": {
                    "translation": "بنّاء"
                },
                "mass": {
                    "translation": "كتلة"
                },
                "match": {
                    "translation": "يطابق"
                },
                "material": {
                    "translation": "مادة"
                },
                "matter": {
                    "translation": "مسألة / مادة"
                },
                "may": {
                    "translation": "مايو"
                },
                "maybe": {
                    "translation": "ربما"
                },
                "me": {
                    "translation": "أنا (مفعول)"
                },
                "mean": {
                    "translation": "يعني"
                },
                "meaning": {
                    "translation": "معنى"
                },
                "means": {
                    "translation": "وسيلة"
                },
                "meanwhile": {
                    "translation": "في هذه الأثناء"
                },
                "measure": {
                    "translation": "يقيس / إجراء"
                },
                "meat": {
                    "translation": "لحم"
                },
                "mechanic": {
                    "translation": "ميكانيكي"
                },
                "mechanism": {
                    "translation": "آلية"
                },
                "medal": {
                    "translation": "ميدالية"
                },
                "media": {
                    "translation": "إعلام"
                },
                "medical": {
                    "translation": "طبي"
                },
                "medicine": {
                    "translation": "دواء"
                },
                "medium": {
                    "translation": "وسيلة"
                },
                "meet": {
                    "translation": "يقابل"
                },
                "meeting": {
                    "translation": "اجتماع"
                },
                "melt": {
                    "translation": "يذوب"
                },
                "member": {
                    "translation": "عضو"
                },
                "membership": {
                    "translation": "عضوية"
                },
                "memory": {
                    "translation": "ذاكرة"
                },
                "mention": {
                    "translation": "يذكر"
                },
                "merchant": {
                    "translation": "تاجر"
                },
                "merge": {
                    "translation": "يدمج"
                },
                "merit": {
                    "translation": "جدارة"
                },
                "message": {
                    "translation": "رسالة"
                },
                "met": {
                    "translation": "التقى"
                },
                "metal": {
                    "translation": "معدن"
                },
                "metaphore": {
                    "translation": "استعارة"
                },
                "method": {
                    "translation": "طريقة"
                },
                "midday": {
                    "translation": "ظهيرة"
                },
                "middle": {
                    "translation": "وسط"
                },
                "might": {
                    "translation": "قد"
                },
                "migration": {
                    "translation": "هجرة"
                },
                "milestone": {
                    "translation": "معلم رئيسي"
                },
                "military": {
                    "translation": "عسكري"
                },
                "milk": {
                    "translation": "حليب"
                },
                "million": {
                    "translation": "مليون"
                },
                "mind": {
                    "translation": "عقل / لا يمانع"
                },
                "mine": {
                    "translation": "خاصتي"
                },
                "minimum": {
                    "translation": "حد أدنى"
                },
                "minister": {
                    "translation": "وزير"
                },
                "minority": {
                    "translation": "أقلية"
                },
                "minute": {
                    "translation": "دقيقة"
                },
                "mirror": {
                    "translation": "مرآة"
                },
                "miss": {
                    "translation": "يشتاق / يفوته"
                },
                "mission": {
                    "translation": "مهمة"
                },
                "mist": {
                    "translation": "ضباب خفيف"
                },
                "mistake": {
                    "translation": "خطأ"
                },
                "mix": {
                    "translation": "يخلط"
                },
                "mixture": {
                    "translation": "خليط"
                },
                "mode": {
                    "translation": "وضع"
                },
                "model": {
                    "translation": "نموذج"
                },
                "modify": {
                    "translation": "يعدّل"
                },
                "moment": {
                    "translation": "لحظة"
                },
                "momentum": {
                    "translation": "زخم"
                },
                "monarchy": {
                    "translation": "ملكية"
                },
                "monday": {
                    "translation": "الاثنين"
                },
                "money": {
                    "translation": "مال"
                },
                "monitor": {
                    "translation": "يرصد"
                },
                "month": {
                    "translation": "شهر"
                },
                "monument": {
                    "translation": "نصب تذكاري"
                },
                "mood": {
                    "translation": "مزاج"
                },
                "moon": {
                    "translation": "قمر"
                },
                "morale": {
                    "translation": "معنويات"
                },
                "more": {
                    "translation": "المزيد"
                },
                "moreover": {
                    "translation": "علاوة على ذلك"
                },
                "morning": {
                    "translation": "صباح"
                },
                "mortgage": {
                    "translation": "رهن"
                },
                "mosque": {
                    "translation": "مسجد"
                },
                "most": {
                    "translation": "معظم"
                },
                "mother": {
                    "translation": "أم"
                },
                "motion": {
                    "translation": "حركة"
                },
                "motivate": {
                    "translation": "يحفز"
                },
                "motive": {
                    "translation": "دافع"
                },
                "mountain": {
                    "translation": "جبل"
                },
                "mourn": {
                    "translation": "يحزن"
                },
                "mouth": {
                    "translation": "فم"
                },
                "move": {
                    "translation": "يتحرك / نقل"
                },
                "movement": {
                    "translation": "حركة"
                },
                "movie": {
                    "translation": "فيلم"
                },
                "much": {
                    "translation": "كثير"
                },
                "mug": {
                    "translation": "كوب"
                },
                "muscle": {
                    "translation": "عضلة"
                },
                "museum": {
                    "translation": "متحف"
                },
                "mushroom": {
                    "translation": "فطر"
                },
                "music": {
                    "translation": "موسيقى"
                },
                "musician": {
                    "translation": "موسيقي"
                },
                "must": {
                    "translation": "يجب"
                },
                "mustache": {
                    "translation": "شارب"
                },
                "mutual": {
                    "translation": "متبادل"
                },
                "my": {
                    "translation": "خاصتي"
                },
                "myself": {
                    "translation": "نفسي"
                },
                "mystery": {
                    "translation": "غموض"
                },
                "myth": {
                    "translation": "أسطورة"
                },
                "nail": {
                    "translation": "مسمار"
                },
                "name": {
                    "translation": "اسم"
                },
                "napkin": {
                    "translation": "منديل"
                },
                "narrative": {
                    "translation": "سرد"
                },
                "narrow": {
                    "translation": "ضيق"
                },
                "nation": {
                    "translation": "أمة"
                },
                "national": {
                    "translation": "وطني"
                },
                "native": {
                    "translation": "أصلي"
                },
                "natural": {
                    "translation": "طبيعي"
                },
                "nature": {
                    "translation": "طبيعة"
                },
                "navigation": {
                    "translation": "ملاحة"
                },
                "near": {
                    "translation": "قريب"
                },
                "nearby": {
                    "translation": "قريب"
                },
                "nearly": {
                    "translation": "تقريباً"
                },
                "necessary": {
                    "translation": "ضروري"
                },
                "necessity": {
                    "translation": "ضرورة"
                },
                "neck": {
                    "translation": "رقبة"
                },
                "necklace": {
                    "translation": "قلادة"
                },
                "need": {
                    "translation": "حاجة"
                },
                "needle": {
                    "translation": "إبرة"
                },
                "negotiate": {
                    "translation": "يتفاوض"
                },
                "neighbor": {
                    "translation": "جار"
                },
                "neighborhood": {
                    "translation": "حي"
                },
                "neighbors": {
                    "translation": "جيران"
                },
                "nerve": {
                    "translation": "عصب"
                },
                "nervous": {
                    "translation": "عصبي"
                },
                "nest": {
                    "translation": "عش"
                },
                "nets": {
                    "translation": "شباك"
                },
                "network": {
                    "translation": "شبكة"
                },
                "neutral": {
                    "translation": "محايد"
                },
                "never": {
                    "translation": "أبداً"
                },
                "new": {
                    "translation": "جديد"
                },
                "news": {
                    "translation": "أخبار"
                },
                "newspaper": {
                    "translation": "جريدة"
                },
                "next": {
                    "translation": "التالي"
                },
                "nice": {
                    "translation": "لطيف"
                },
                "niche": {
                    "translation": "نيتش"
                },
                "night": {
                    "translation": "ليل"
                },
                "nightmare": {
                    "translation": "كابوس"
                },
                "nine": {
                    "translation": "تسعة"
                },
                "nineteen": {
                    "translation": "تسعة عشر"
                },
                "ninety": {
                    "translation": "تسعون"
                },
                "nitrogen": {
                    "translation": "نيتروجين"
                },
                "no": {
                    "translation": "لا"
                },
                "noise": {
                    "translation": "ضجة"
                },
                "nomination": {
                    "translation": "ترشيح"
                },
                "norm": {
                    "translation": "معيار"
                },
                "normal": {
                    "translation": "عادي"
                },
                "normally": {
                    "translation": "عاديا"
                },
                "north": {
                    "translation": "شمال"
                },
                "nose": {
                    "translation": "أنف"
                },
                "not": {
                    "translation": "ليس"
                },
                "note": {
                    "translation": "ملاحظة / نوتة"
                },
                "notebook": {
                    "translation": "دفتر"
                },
                "nothing": {
                    "translation": "لا شيء"
                },
                "notice": {
                    "translation": "يلاحظ"
                },
                "notion": {
                    "translation": "فكرة"
                },
                "novel": {
                    "translation": "رواية"
                },
                "november": {
                    "translation": "نوفمبر"
                },
                "now": {
                    "translation": "الآن"
                },
                "nowhere": {
                    "translation": "لا مكان"
                },
                "nucleus": {
                    "translation": "نواة"
                },
                "number": {
                    "translation": "رقم / عدد"
                },
                "nurse": {
                    "translation": "ممرضة"
                },
                "nursery": {
                    "translation": "حضانة"
                },
                "nutrition": {
                    "translation": "تغذية"
                },
                "oath": {
                    "translation": "قسم"
                },
                "object": {
                    "translation": "غرض"
                },
                "obligation": {
                    "translation": "التزام"
                },
                "observation": {
                    "translation": "مراقبة"
                },
                "observe": {
                    "translation": "يراقب"
                },
                "occasion": {
                    "translation": "مناسبة"
                },
                "occupation": {
                    "translation": "مهنة / احتلال"
                },
                "occur": {
                    "translation": "يحدث"
                },
                "ocean": {
                    "translation": "محيط"
                },
                "october": {
                    "translation": "أكتوبر"
                },
                "of": {
                    "translation": "من"
                },
                "off": {
                    "translation": "إيقاف / بعيد"
                },
                "offer": {
                    "translation": "يعرض / عرض"
                },
                "offering": {
                    "translation": "عرض"
                },
                "office": {
                    "translation": "مكتب"
                },
                "officer": {
                    "translation": "ضابط"
                },
                "official": {
                    "translation": "رسمي / مسؤول"
                },
                "often": {
                    "translation": "غالباً"
                },
                "oh": {
                    "translation": "أوه"
                },
                "oil": {
                    "translation": "نفط / زيت"
                },
                "ok": {
                    "translation": "حسناً"
                },
                "old": {
                    "translation": "قديم"
                },
                "on": {
                    "translation": "على"
                },
                "once": {
                    "translation": "مرة واحدة"
                },
                "one": {
                    "translation": "واحد"
                },
                "onion": {
                    "translation": "بصل"
                },
                "only": {
                    "translation": "فقط"
                },
                "onto": {
                    "translation": "على"
                },
                "open": {
                    "translation": "مفتوح"
                },
                "opened": {
                    "translation": "فتح"
                },
                "openness": {
                    "translation": "انفتاح"
                },
                "operate": {
                    "translation": "يشغّل"
                },
                "operation": {
                    "translation": "عملية / عملية جراحية"
                },
                "opponent": {
                    "translation": "خصم"
                },
                "opportunity": {
                    "translation": "فرصة"
                },
                "opposition": {
                    "translation": "معارضة"
                },
                "option": {
                    "translation": "خيار"
                },
                "or": {
                    "translation": "أو"
                },
                "orange": {
                    "translation": "برتقالي"
                },
                "orbit": {
                    "translation": "مدار"
                },
                "orchard": {
                    "translation": "بستان"
                },
                "order": {
                    "translation": "طلب / نظام"
                },
                "organism": {
                    "translation": "كائن حي"
                },
                "organization": {
                    "translation": "منظمة"
                },
                "organize": {
                    "translation": "ينظم"
                },
                "organized": {
                    "translation": "منظم"
                },
                "origin": {
                    "translation": "أصل"
                },
                "other": {
                    "translation": "آخر"
                },
                "others": {
                    "translation": "آخرون"
                },
                "otherwise": {
                    "translation": "وإلا"
                },
                "our": {
                    "translation": "خاصتنا"
                },
                "ours": {
                    "translation": "لنا"
                },
                "ourselves": {
                    "translation": "أنفسنا"
                },
                "out": {
                    "translation": "خارج"
                },
                "outcome": {
                    "translation": "نتيجة"
                },
                "output": {
                    "translation": "مخرجات"
                },
                "outrage": {
                    "translation": "سخط"
                },
                "outside": {
                    "translation": "خارج"
                },
                "over": {
                    "translation": "فوق"
                },
                "owe": {
                    "translation": "يدين"
                },
                "own": {
                    "translation": "خاصة / يملك"
                },
                "ownership": {
                    "translation": "ملكية"
                },
                "pace": {
                    "translation": "وتيرة"
                },
                "pack": {
                    "translation": "يحزم"
                },
                "pact": {
                    "translation": "معاهدة"
                },
                "page": {
                    "translation": "صفحة"
                },
                "pain": {
                    "translation": "ألم"
                },
                "paint": {
                    "translation": "يطلي"
                },
                "painter": {
                    "translation": "رسام"
                },
                "pair": {
                    "translation": "زوج"
                },
                "palace": {
                    "translation": "قصر"
                },
                "pan": {
                    "translation": "مقلاة"
                },
                "panel": {
                    "translation": "لوحة"
                },
                "panic": {
                    "translation": "ذعر"
                },
                "pants": {
                    "translation": "بنطال"
                },
                "paper": {
                    "translation": "ورق / بحث"
                },
                "parade": {
                    "translation": "موكب"
                },
                "paragraph": {
                    "translation": "فقرة"
                },
                "parallel": {
                    "translation": "متوازٍ"
                },
                "parent": {
                    "translation": "والد"
                },
                "parents": {
                    "translation": "الوالدان"
                },
                "park": {
                    "translation": "حديقة"
                },
                "parliament": {
                    "translation": "برلمان"
                },
                "part": {
                    "translation": "جزء"
                },
                "participant": {
                    "translation": "مشارك"
                },
                "participate": {
                    "translation": "يشارك"
                },
                "particular": {
                    "translation": "خاص"
                },
                "particularly": {
                    "translation": "خصوصاً"
                },
                "partner": {
                    "translation": "شريك"
                },
                "partnership": {
                    "translation": "شراكة"
                },
                "party": {
                    "translation": "حفلة / حزب"
                },
                "pass": {
                    "translation": "يمرر / يجتاز"
                },
                "passage": {
                    "translation": "مقطع"
                },
                "passion": {
                    "translation": "شغف"
                },
                "past": {
                    "translation": "ماضي"
                },
                "paste": {
                    "translation": "معجون"
                },
                "pat": {
                    "translation": "يربت"
                },
                "path": {
                    "translation": "مسار"
                },
                "patience": {
                    "translation": "صبر"
                },
                "patient": {
                    "translation": "مريض / صبور"
                },
                "patrol": {
                    "translation": "دورية"
                },
                "pattern": {
                    "translation": "نمط"
                },
                "pause": {
                    "translation": "يوقف مؤقتًا"
                },
                "pavement": {
                    "translation": "رصيف"
                },
                "paw": {
                    "translation": "كف"
                },
                "pay": {
                    "translation": "يدفع"
                },
                "payment": {
                    "translation": "دفعة"
                },
                "peace": {
                    "translation": "سلام"
                },
                "peaceful": {
                    "translation": "مسالم"
                },
                "peak": {
                    "translation": "قمة"
                },
                "peasant": {
                    "translation": "فلاح"
                },
                "peel": {
                    "translation": "يقشر"
                },
                "pen": {
                    "translation": "قلم"
                },
                "pension": {
                    "translation": "معاش"
                },
                "people": {
                    "translation": "الناس"
                },
                "per": {
                    "translation": "لكل"
                },
                "percentage": {
                    "translation": "نسبة مئوية"
                },
                "perception": {
                    "translation": "إدراك"
                },
                "perform": {
                    "translation": "يؤدي"
                },
                "performance": {
                    "translation": "أداء"
                },
                "perhaps": {
                    "translation": "ربما"
                },
                "period": {
                    "translation": "فترة"
                },
                "permission": {
                    "translation": "إذن"
                },
                "permit": {
                    "translation": "يسمح"
                },
                "person": {
                    "translation": "شخص"
                },
                "persona": {
                    "translation": "شخصية"
                },
                "personal": {
                    "translation": "شخصي"
                },
                "perspective": {
                    "translation": "منظور"
                },
                "persuade": {
                    "translation": "يقنع"
                },
                "pharmacist": {
                    "translation": "صيدلي"
                },
                "phase": {
                    "translation": "مرحلة"
                },
                "philosophy": {
                    "translation": "فلسفة"
                },
                "phone": {
                    "translation": "هاتف"
                },
                "photo": {
                    "translation": "صورة فوتوغرافية"
                },
                "photographer": {
                    "translation": "مصوّر"
                },
                "phrase": {
                    "translation": "عبارة"
                },
                "physical": {
                    "translation": "جسدي"
                },
                "pick": {
                    "translation": "يختار / يقطف"
                },
                "picture": {
                    "translation": "صورة"
                },
                "piece": {
                    "translation": "قطعة"
                },
                "pile": {
                    "translation": "كومة"
                },
                "pillow": {
                    "translation": "وسادة"
                },
                "pilot": {
                    "translation": "طيّار"
                },
                "pink": {
                    "translation": "وردي"
                },
                "pipe": {
                    "translation": "أنبوب"
                },
                "place": {
                    "translation": "مكان"
                },
                "plan": {
                    "translation": "خطة / يخطط"
                },
                "plane": {
                    "translation": "طائرة"
                },
                "plant": {
                    "translation": "نبات / مصنع"
                },
                "plastic": {
                    "translation": "بلاستيك"
                },
                "plate": {
                    "translation": "طبق"
                },
                "play": {
                    "translation": "يلعب / مسرحية"
                },
                "player": {
                    "translation": "لاعب"
                },
                "please": {
                    "translation": "يُرضي"
                },
                "pleasure": {
                    "translation": "متعة"
                },
                "plenty": {
                    "translation": "وفير"
                },
                "plumber": {
                    "translation": "سبّاك"
                },
                "PM": {
                    "translation": "مساءً"
                },
                "pocket": {
                    "translation": "جيب"
                },
                "poet": {
                    "translation": "شاعر"
                },
                "point": {
                    "translation": "نقطة / يشير"
                },
                "police": {
                    "translation": "شرطة"
                },
                "policy": {
                    "translation": "سياسة"
                },
                "polite": {
                    "translation": "مؤدب"
                },
                "political": {
                    "translation": "سياسي"
                },
                "politics": {
                    "translation": "سياسة"
                },
                "pond": {
                    "translation": "بركة"
                },
                "pool": {
                    "translation": "حمام سباحة"
                },
                "poor": {
                    "translation": "فقير / رديء"
                },
                "popular": {
                    "translation": "شائع"
                },
                "population": {
                    "translation": "سكان"
                },
                "position": {
                    "translation": "منصب / وضع"
                },
                "positive": {
                    "translation": "إيجابي"
                },
                "possess": {
                    "translation": "يمتلك"
                },
                "possibility": {
                    "translation": "إمكانية"
                },
                "possible": {
                    "translation": "ممكن"
                },
                "pot": {
                    "translation": "قدر"
                },
                "potato": {
                    "translation": "بطاطا"
                },
                "potluck": {
                    "translation": "وجبة مشتركة"
                },
                "pour": {
                    "translation": "يصب"
                },
                "poverty": {
                    "translation": "فقر"
                },
                "power": {
                    "translation": "قوة / طاقة"
                },
                "practice": {
                    "translation": "ممارسة / تدرب"
                },
                "practiced": {
                    "translation": "مارس"
                },
                "praise": {
                    "translation": "يمدح"
                },
                "prefer": {
                    "translation": "يفضل"
                },
                "preference": {
                    "translation": "تفضيل"
                },
                "preparation": {
                    "translation": "تحضير"
                },
                "prepare": {
                    "translation": "يحضر"
                },
                "prescribe": {
                    "translation": "يصف دواء"
                },
                "present": {
                    "translation": "حاضر / هدية / يقدم"
                },
                "president": {
                    "translation": "رئيس"
                },
                "press": {
                    "translation": "يضغط"
                },
                "pressure": {
                    "translation": "ضغط"
                },
                "pretend": {
                    "translation": "يتظاهر"
                },
                "pretty": {
                    "translation": "جميل / إلى حد ما"
                },
                "prevent": {
                    "translation": "يمنع"
                },
                "previous": {
                    "translation": "سابق"
                },
                "price": {
                    "translation": "سعر"
                },
                "pride": {
                    "translation": "كبرياء"
                },
                "principle": {
                    "translation": "مبدأ"
                },
                "prison": {
                    "translation": "سجن"
                },
                "privacy": {
                    "translation": "خصوصية"
                },
                "private": {
                    "translation": "خاص"
                },
                "prize": {
                    "translation": "جائزة"
                },
                "probably": {
                    "translation": "على الأرجح"
                },
                "problem": {
                    "translation": "مشكلة"
                },
                "procedure": {
                    "translation": "إجراء"
                },
                "process": {
                    "translation": "عملية / يعالج"
                },
                "produce": {
                    "translation": "ينتج"
                },
                "producer": {
                    "translation": "منتج"
                },
                "product": {
                    "translation": "منتج"
                },
                "production": {
                    "translation": "إنتاج"
                },
                "profession": {
                    "translation": "مهنة"
                },
                "professor": {
                    "translation": "أستاذ"
                },
                "profit": {
                    "translation": "ربح"
                },
                "program": {
                    "translation": "برنامج"
                },
                "progress": {
                    "translation": "يتقدم"
                },
                "project": {
                    "translation": "مشروع"
                },
                "promise": {
                    "translation": "يعد"
                },
                "proof": {
                    "translation": "دليل"
                },
                "property": {
                    "translation": "ملكية"
                },
                "proposal": {
                    "translation": "اقتراح"
                },
                "propose": {
                    "translation": "يقترح"
                },
                "protect": {
                    "translation": "يحمي"
                },
                "protection": {
                    "translation": "حماية"
                },
                "proud": {
                    "translation": "فخور"
                },
                "prove": {
                    "translation": "يثبت"
                },
                "provide": {
                    "translation": "يوفر"
                },
                "public": {
                    "translation": "عام"
                },
                "pull": {
                    "translation": "يسحب"
                },
                "punch": {
                    "translation": "يضرب بالقبضة"
                },
                "purple": {
                    "translation": "بنفسجي"
                },
                "purpose": {
                    "translation": "غرض"
                },
                "purse": {
                    "translation": "حقيبة يد"
                },
                "push": {
                    "translation": "يدفع"
                },
                "put": {
                    "translation": "يضع"
                },
                "quality": {
                    "translation": "جودة"
                },
                "quantity": {
                    "translation": "كمية"
                },
                "question": {
                    "translation": "سؤال"
                },
                "quickly": {
                    "translation": "بسرعة"
                },
                "quiet": {
                    "translation": "هادئ"
                },
                "quite": {
                    "translation": "تماماً"
                },
                "quiver": {
                    "translation": "يرتعش"
                },
                "race": {
                    "translation": "سباق / عرق"
                },
                "radio": {
                    "translation": "راديو"
                },
                "rain": {
                    "translation": "مطر"
                },
                "raise": {
                    "translation": "يرفع / يربي"
                },
                "range": {
                    "translation": "مدى / يتراوح"
                },
                "rare": {
                    "translation": "نادر"
                },
                "rate": {
                    "translation": "معدل / يقيم"
                },
                "rather": {
                    "translation": "بدلاً من"
                },
                "razor": {
                    "translation": "شفرة"
                },
                "reach": {
                    "translation": "يصل"
                },
                "reaching": {
                    "translation": "وصول"
                },
                "reaction": {
                    "translation": "رد فعل"
                },
                "read": {
                    "translation": "يقرأ"
                },
                "ready": {
                    "translation": "جاهز"
                },
                "real": {
                    "translation": "حقيقي"
                },
                "reality": {
                    "translation": "واقع"
                },
                "realize": {
                    "translation": "يدرك"
                },
                "really": {
                    "translation": "حقاً"
                },
                "reason": {
                    "translation": "سبب"
                },
                "receive": {
                    "translation": "يتلقى"
                },
                "recent": {
                    "translation": "حديث"
                },
                "recently": {
                    "translation": "مؤخراً"
                },
                "recognize": {
                    "translation": "يعترف / يميز"
                },
                "recommend": {
                    "translation": "يوصي"
                },
                "record": {
                    "translation": "سجل / تسجيل"
                },
                "recover": {
                    "translation": "يتعافى"
                },
                "recovery": {
                    "translation": "تعافٍ"
                },
                "red": {
                    "translation": "أحمر"
                },
                "reduce": {
                    "translation": "يقلل"
                },
                "refer": {
                    "translation": "يشير"
                },
                "referee": {
                    "translation": "حكم"
                },
                "reference": {
                    "translation": "مرجع"
                },
                "reform": {
                    "translation": "إصلاح"
                },
                "refuse": {
                    "translation": "يرفض"
                },
                "region": {
                    "translation": "منطقة"
                },
                "register": {
                    "translation": "سجل"
                },
                "regulate": {
                    "translation": "ينظم"
                },
                "related": {
                    "translation": "ذات صلة"
                },
                "relation": {
                    "translation": "علاقة"
                },
                "relationship": {
                    "translation": "علاقة"
                },
                "relax": {
                    "translation": "يسترخي"
                },
                "release": {
                    "translation": "إطلاق"
                },
                "relief": {
                    "translation": "ارتياح"
                },
                "religion": {
                    "translation": "دين"
                },
                "religious": {
                    "translation": "ديني"
                },
                "remain": {
                    "translation": "يبقى"
                },
                "remark": {
                    "translation": "ملاحظة"
                },
                "remember": {
                    "translation": "يتذكر"
                },
                "remind": {
                    "translation": "يذكّر"
                },
                "remove": {
                    "translation": "يزيل"
                },
                "repair": {
                    "translation": "يصلح"
                },
                "repeat": {
                    "translation": "يكرر"
                },
                "repeatedly": {
                    "translation": "بشكل متكرر"
                },
                "reply": {
                    "translation": "يرد"
                },
                "report": {
                    "translation": "تقرير / يبلغ"
                },
                "represent": {
                    "translation": "يمثل"
                },
                "Republican": {
                    "translation": "جمهوري"
                },
                "request": {
                    "translation": "يطلب"
                },
                "require": {
                    "translation": "يتطلب"
                },
                "requirement": {
                    "translation": "متطلب"
                },
                "research": {
                    "translation": "بحث"
                },
                "resemble": {
                    "translation": "يشبه"
                },
                "residents": {
                    "translation": "سكان"
                },
                "resilience": {
                    "translation": "مرونة"
                },
                "resolve": {
                    "translation": "يحل"
                },
                "resource": {
                    "translation": "مورد"
                },
                "resourceful": {
                    "translation": "ذكي"
                },
                "respect": {
                    "translation": "يحترم"
                },
                "respond": {
                    "translation": "يرد"
                },
                "response": {
                    "translation": "رد"
                },
                "responsibility": {
                    "translation": "مسؤولية"
                },
                "rest": {
                    "translation": "راحة / الباقي"
                },
                "restaurant": {
                    "translation": "مطعم"
                },
                "resting": {
                    "translation": "يرتاح"
                },
                "result": {
                    "translation": "نتيجة"
                },
                "resume": {
                    "translation": "يستأنف"
                },
                "retreat": {
                    "translation": "ينسحب"
                },
                "return": {
                    "translation": "يعود / عودة"
                },
                "reveal": {
                    "translation": "يكشف"
                },
                "revenue": {
                    "translation": "إيراد"
                },
                "review": {
                    "translation": "مراجعة"
                },
                "reward": {
                    "translation": "مكافأة"
                },
                "rice": {
                    "translation": "أرز"
                },
                "rich": {
                    "translation": "غني"
                },
                "right": {
                    "translation": "يمين / صحيح / حق"
                },
                "ring": {
                    "translation": "يرن"
                },
                "rip": {
                    "translation": "يمزق"
                },
                "rise": {
                    "translation": "يرتفع / صعود"
                },
                "risk": {
                    "translation": "خطر"
                },
                "rival": {
                    "translation": "منافس"
                },
                "river": {
                    "translation": "نهر"
                },
                "road": {
                    "translation": "طريق"
                },
                "roast": {
                    "translation": "يشوي"
                },
                "rock": {
                    "translation": "صخرة / روك"
                },
                "role": {
                    "translation": "دور"
                },
                "roll": {
                    "translation": "يتدحرج"
                },
                "roof": {
                    "translation": "سطح"
                },
                "room": {
                    "translation": "غرفة"
                },
                "root": {
                    "translation": "جذر"
                },
                "rope": {
                    "translation": "حبل"
                },
                "rotate": {
                    "translation": "يدور"
                },
                "route": {
                    "translation": "طريق"
                },
                "rude": {
                    "translation": "وقح"
                },
                "rule": {
                    "translation": "قاعدة / يحكم"
                },
                "run": {
                    "translation": "يجري / يدير"
                },
                "sad": {
                    "translation": "حزين"
                },
                "safe": {
                    "translation": "آمن"
                },
                "safer": {
                    "translation": "أكثر أماناً"
                },
                "safety": {
                    "translation": "سلامة"
                },
                "said": {
                    "translation": "قال"
                },
                "sail": {
                    "translation": "يبحر"
                },
                "sailor": {
                    "translation": "بحّار"
                },
                "salad": {
                    "translation": "سلطة"
                },
                "salt": {
                    "translation": "ملح"
                },
                "salty": {
                    "translation": "مالح"
                },
                "same": {
                    "translation": "نفس"
                },
                "sample": {
                    "translation": "عينة"
                },
                "sand": {
                    "translation": "رمل"
                },
                "sandal": {
                    "translation": "صندل"
                },
                "sat": {
                    "translation": "جلس"
                },
                "satisfy": {
                    "translation": "يرضي"
                },
                "saturday": {
                    "translation": "السبت"
                },
                "saucer": {
                    "translation": "صحن"
                },
                "save": {
                    "translation": "يحفظ / ينقذ"
                },
                "say": {
                    "translation": "يقول"
                },
                "scale": {
                    "translation": "مقياس"
                },
                "scarce": {
                    "translation": "شحيح"
                },
                "scarf": {
                    "translation": "وشاح"
                },
                "scatter": {
                    "translation": "يوزّع"
                },
                "scene": {
                    "translation": "مشهد"
                },
                "scheme": {
                    "translation": "مخطط"
                },
                "school": {
                    "translation": "مدرسة"
                },
                "science": {
                    "translation": "علم"
                },
                "scope": {
                    "translation": "نطاق"
                },
                "score": {
                    "translation": "نقاط"
                },
                "sculptor": {
                    "translation": "نحات"
                },
                "sea": {
                    "translation": "بحر"
                },
                "search": {
                    "translation": "يبحث"
                },
                "season": {
                    "translation": "موسم"
                },
                "seat": {
                    "translation": "مقعد"
                },
                "second": {
                    "translation": "ثانية / ثان"
                },
                "section": {
                    "translation": "قسم"
                },
                "security": {
                    "translation": "أمن"
                },
                "see": {
                    "translation": "يرى"
                },
                "seed": {
                    "translation": "بذرة"
                },
                "seek": {
                    "translation": "يبحث عن"
                },
                "seem": {
                    "translation": "يبدو"
                },
                "selection": {
                    "translation": "اختيار"
                },
                "sell": {
                    "translation": "يبيع"
                },
                "seller": {
                    "translation": "بائع"
                },
                "send": {
                    "translation": "يرسل"
                },
                "sense": {
                    "translation": "حاسة / معنى"
                },
                "sentence": {
                    "translation": "جملة"
                },
                "separate": {
                    "translation": "يفصل"
                },
                "september": {
                    "translation": "سبتمبر"
                },
                "serenity": {
                    "translation": "صفاء"
                },
                "series": {
                    "translation": "سلسلة"
                },
                "serious": {
                    "translation": "جدي"
                },
                "serve": {
                    "translation": "يخدم"
                },
                "service": {
                    "translation": "خدمة"
                },
                "session": {
                    "translation": "جلسة"
                },
                "set": {
                    "translation": "يضع / مجموعة"
                },
                "settle": {
                    "translation": "يسوى"
                },
                "seven": {
                    "translation": "سبعة"
                },
                "seventeen": {
                    "translation": "سبعة عشر"
                },
                "seventy": {
                    "translation": "سبعون"
                },
                "several": {
                    "translation": "عدة"
                },
                "sex": {
                    "translation": "جنس"
                },
                "shadows": {
                    "translation": "ظلال"
                },
                "shake": {
                    "translation": "يهز"
                },
                "shallow": {
                    "translation": "ضحل"
                },
                "shampoo": {
                    "translation": "شامبو"
                },
                "shape": {
                    "translation": "شكل"
                },
                "share": {
                    "translation": "يشارك / حصة"
                },
                "shared": {
                    "translation": "مشترك"
                },
                "sharp": {
                    "translation": "حاد"
                },
                "she": {
                    "translation": "هي"
                },
                "sheet": {
                    "translation": "ملاءة"
                },
                "shelter": {
                    "translation": "مأوى"
                },
                "shepherd": {
                    "translation": "راعي"
                },
                "shift": {
                    "translation": "يزيح"
                },
                "ship": {
                    "translation": "سفينة"
                },
                "shirt": {
                    "translation": "قميص"
                },
                "shock": {
                    "translation": "يصيب بصدمة"
                },
                "shoes": {
                    "translation": "حذاء"
                },
                "shoot": {
                    "translation": "يطلق النار / يصور"
                },
                "shop": {
                    "translation": "متجر"
                },
                "shore": {
                    "translation": "شاطئ"
                },
                "short": {
                    "translation": "قصير"
                },
                "shortage": {
                    "translation": "عجز"
                },
                "should": {
                    "translation": "ينبغي"
                },
                "shoulder": {
                    "translation": "كتف"
                },
                "shout": {
                    "translation": "يصرخ"
                },
                "show": {
                    "translation": "يُظهر / عرض"
                },
                "shy": {
                    "translation": "خجول"
                },
                "sick": {
                    "translation": "مريض"
                },
                "side": {
                    "translation": "جانب"
                },
                "sight": {
                    "translation": "بصر"
                },
                "sign": {
                    "translation": "علامة / يوقع"
                },
                "signature": {
                    "translation": "توقيع"
                },
                "significance": {
                    "translation": "دلالة"
                },
                "significant": {
                    "translation": "هام"
                },
                "silver": {
                    "translation": "فضي"
                },
                "similar": {
                    "translation": "مشابه"
                },
                "similarity": {
                    "translation": "تشابه"
                },
                "simple": {
                    "translation": "بسيط"
                },
                "simply": {
                    "translation": "ببساطة"
                },
                "since": {
                    "translation": "منذ / لأن"
                },
                "sing": {
                    "translation": "يغني"
                },
                "singer": {
                    "translation": "مغنٍّ"
                },
                "single": {
                    "translation": "واحد / أعزب"
                },
                "sink": {
                    "translation": "يغرق"
                },
                "sister": {
                    "translation": "أخت"
                },
                "sit": {
                    "translation": "يجلس"
                },
                "site": {
                    "translation": "موقع"
                },
                "situation": {
                    "translation": "وضع"
                },
                "six": {
                    "translation": "ستة"
                },
                "sixteen": {
                    "translation": "ستة عشر"
                },
                "sixty": {
                    "translation": "ستون"
                },
                "size": {
                    "translation": "حجم"
                },
                "skill": {
                    "translation": "مهارة"
                },
                "skin": {
                    "translation": "جلد"
                },
                "sky": {
                    "translation": "سماء"
                },
                "slap": {
                    "translation": "يصفق"
                },
                "sleep": {
                    "translation": "ينام"
                },
                "slice": {
                    "translation": "يقطّع"
                },
                "slide": {
                    "translation": "ينزلق"
                },
                "slip": {
                    "translation": "يزل"
                },
                "slipper": {
                    "translation": "نعال"
                },
                "slow": {
                    "translation": "بطيء"
                },
                "slowly": {
                    "translation": "ببطء"
                },
                "small": {
                    "translation": "صغير"
                },
                "smile": {
                    "translation": "ابتسامة"
                },
                "snow": {
                    "translation": "ثلج"
                },
                "so": {
                    "translation": "لذلك / هكذا"
                },
                "soap": {
                    "translation": "صابون"
                },
                "social": {
                    "translation": "اجتماعي"
                },
                "society": {
                    "translation": "مجتمع"
                },
                "sock": {
                    "translation": "جورب"
                },
                "sofa": {
                    "translation": "أريكة"
                },
                "soft": {
                    "translation": "لين"
                },
                "software": {
                    "translation": "برمجيات"
                },
                "soil": {
                    "translation": "تربة"
                },
                "soldier": {
                    "translation": "جندي"
                },
                "solitude": {
                    "translation": "عزلة"
                },
                "solution": {
                    "translation": "حل"
                },
                "solve": {
                    "translation": "يحل"
                },
                "some": {
                    "translation": "بعض"
                },
                "somehow": {
                    "translation": "بطريقة ما"
                },
                "someone": {
                    "translation": "شخص ما"
                },
                "something": {
                    "translation": "شيء ما"
                },
                "sometimes": {
                    "translation": "أحياناً"
                },
                "somewhat": {
                    "translation": "إلى حد ما"
                },
                "somewhere": {
                    "translation": "مكان ما"
                },
                "son": {
                    "translation": "ابن"
                },
                "song": {
                    "translation": "أغنية"
                },
                "soon": {
                    "translation": "قريباً"
                },
                "sorrow": {
                    "translation": "حزن"
                },
                "sort": {
                    "translation": "نوع / يرتب"
                },
                "sound": {
                    "translation": "صوت"
                },
                "soup": {
                    "translation": "شوربة"
                },
                "sour": {
                    "translation": "حامض"
                },
                "source": {
                    "translation": "مصدر"
                },
                "south": {
                    "translation": "جنوب"
                },
                "space": {
                    "translation": "فضاء / مساحة"
                },
                "speak": {
                    "translation": "يتكلم"
                },
                "speaker": {
                    "translation": "متحدث"
                },
                "special": {
                    "translation": "خاص"
                },
                "specialist": {
                    "translation": "أخصائي"
                },
                "specific": {
                    "translation": "محدد"
                },
                "specify": {
                    "translation": "يحدد"
                },
                "speech": {
                    "translation": "خطاب"
                },
                "speed": {
                    "translation": "سرعة"
                },
                "spend": {
                    "translation": "ينفق"
                },
                "spice": {
                    "translation": "توابل"
                },
                "spicy": {
                    "translation": "حار"
                },
                "spill": {
                    "translation": "يسكب"
                },
                "spirit": {
                    "translation": "روح"
                },
                "split": {
                    "translation": "يشق"
                },
                "spoon": {
                    "translation": "ملعقة"
                },
                "sport": {
                    "translation": "رياضة"
                },
                "spread": {
                    "translation": "انتشار"
                },
                "spring": {
                    "translation": "ربيع / ينبوع"
                },
                "square": {
                    "translation": "مربع"
                },
                "squeeze": {
                    "translation": "يعصر"
                },
                "stack": {
                    "translation": "كومة"
                },
                "staff": {
                    "translation": "طاقم عمل"
                },
                "stage": {
                    "translation": "مرحلة / خشبة المسرح"
                },
                "stair": {
                    "translation": "درج"
                },
                "stand": {
                    "translation": "يقف"
                },
                "standard": {
                    "translation": "معيار"
                },
                "star": {
                    "translation": "نجم"
                },
                "start": {
                    "translation": "يبدأ"
                },
                "state": {
                    "translation": "ولاية / حالة"
                },
                "statement": {
                    "translation": "بيان"
                },
                "station": {
                    "translation": "محطة"
                },
                "status": {
                    "translation": "وضع"
                },
                "stay": {
                    "translation": "يبقى"
                },
                "step": {
                    "translation": "خطوة / يخطو"
                },
                "still": {
                    "translation": "ما يزال"
                },
                "stir": {
                    "translation": "يقلّب"
                },
                "stock": {
                    "translation": "مخزون / أسهم"
                },
                "stomach": {
                    "translation": "معدة"
                },
                "stone": {
                    "translation": "حجر"
                },
                "stop": {
                    "translation": "يتوقف"
                },
                "store": {
                    "translation": "متجر / يخزن"
                },
                "stories": {
                    "translation": "قصص"
                },
                "storm": {
                    "translation": "عاصفة"
                },
                "story": {
                    "translation": "قصة"
                },
                "strange": {
                    "translation": "غريب"
                },
                "stranger": {
                    "translation": "غريب"
                },
                "strangers": {
                    "translation": "غرباء"
                },
                "strategy": {
                    "translation": "استراتيجية"
                },
                "straw": {
                    "translation": "شفاطة"
                },
                "stream": {
                    "translation": "جدول"
                },
                "street": {
                    "translation": "شارع"
                },
                "strength": {
                    "translation": "قوة"
                },
                "stress": {
                    "translation": "توتر"
                },
                "stretch": {
                    "translation": "يمدد"
                },
                "strike": {
                    "translation": "يضرب"
                },
                "stroke": {
                    "translation": "يلمس بلطف"
                },
                "strong": {
                    "translation": "قوي"
                },
                "stronger": {
                    "translation": "أقوى"
                },
                "structure": {
                    "translation": "هيكل"
                },
                "struggle": {
                    "translation": "كفاح"
                },
                "student": {
                    "translation": "طالب"
                },
                "study": {
                    "translation": "يدرس / دراسة"
                },
                "stuff": {
                    "translation": "أشياء"
                },
                "stumble": {
                    "translation": "يتعثر"
                },
                "style": {
                    "translation": "أسلوب"
                },
                "subject": {
                    "translation": "موضوع / مادة"
                },
                "succeed": {
                    "translation": "ينجح"
                },
                "success": {
                    "translation": "نجاح"
                },
                "such": {
                    "translation": "مثل هذا"
                },
                "suddenly": {
                    "translation": "فجأة"
                },
                "sugar": {
                    "translation": "سكر"
                },
                "suggest": {
                    "translation": "يقترح"
                },
                "suggestion": {
                    "translation": "اقتراح"
                },
                "suit": {
                    "translation": "يناسب"
                },
                "suitcase": {
                    "translation": "حقيبة سفر"
                },
                "summer": {
                    "translation": "صيف"
                },
                "sun": {
                    "translation": "شمس"
                },
                "sunday": {
                    "translation": "الأحد"
                },
                "supply": {
                    "translation": "يمدّ بـ"
                },
                "support": {
                    "translation": "دعم"
                },
                "supportive": {
                    "translation": "داعم"
                },
                "suppose": {
                    "translation": "يفترض"
                },
                "sure": {
                    "translation": "متأكد"
                },
                "surface": {
                    "translation": "سطح"
                },
                "surgeon": {
                    "translation": "جراح"
                },
                "surprise": {
                    "translation": "يفاجئ"
                },
                "survey": {
                    "translation": "استطلاع"
                },
                "survival": {
                    "translation": "بقاء"
                },
                "survive": {
                    "translation": "ينجو"
                },
                "sweet": {
                    "translation": "حلو"
                },
                "swim": {
                    "translation": "يسبح"
                },
                "symbol": {
                    "translation": "رمز"
                },
                "symbolize": {
                    "translation": "يرمز"
                },
                "system": {
                    "translation": "نظام"
                },
                "table": {
                    "translation": "طاولة / جدول"
                },
                "tail": {
                    "translation": "ذيل"
                },
                "take": {
                    "translation": "يأخذ"
                },
                "talent": {
                    "translation": "موهبة"
                },
                "talk": {
                    "translation": "يتحدث"
                },
                "tap": {
                    "translation": "يطرق"
                },
                "target": {
                    "translation": "هدف"
                },
                "task": {
                    "translation": "مهمة"
                },
                "taste": {
                    "translation": "طعم"
                },
                "tasty": {
                    "translation": "لذيذ"
                },
                "taught": {
                    "translation": "علم"
                },
                "tax": {
                    "translation": "ضريبة"
                },
                "taxi": {
                    "translation": "سيارة أجرة"
                },
                "tea": {
                    "translation": "شاي"
                },
                "teach": {
                    "translation": "يعلم"
                },
                "teacher": {
                    "translation": "معلم"
                },
                "team": {
                    "translation": "فريق"
                },
                "teapot": {
                    "translation": "إبريق"
                },
                "tear": {
                    "translation": "يمزق"
                },
                "technician": {
                    "translation": "فني"
                },
                "technology": {
                    "translation": "تكنولوجيا"
                },
                "television": {
                    "translation": "تلفزيون"
                },
                "tell": {
                    "translation": "يخبر"
                },
                "temperature": {
                    "translation": "درجة حرارة"
                },
                "ten": {
                    "translation": "عشرة"
                },
                "tend": {
                    "translation": "يميل"
                },
                "tendency": {
                    "translation": "ميل"
                },
                "term": {
                    "translation": "مصطلح / فترة"
                },
                "test": {
                    "translation": "اختبار / يختبر"
                },
                "than": {
                    "translation": "أكثر من / أقل من"
                },
                "thank": {
                    "translation": "شكر"
                },
                "that": {
                    "translation": "ذلك / أن"
                },
                "the": {
                    "translation": "الـ"
                },
                "their": {
                    "translation": "خاصتهم"
                },
                "theirs": {
                    "translation": "لهم"
                },
                "them": {
                    "translation": "هم (مفعول)"
                },
                "themselves": {
                    "translation": "أنفسهم"
                },
                "then": {
                    "translation": "ثم"
                },
                "theory": {
                    "translation": "نظرية"
                },
                "there": {
                    "translation": "هناك"
                },
                "therefore": {
                    "translation": "لذلك"
                },
                "these": {
                    "translation": "هؤلاء"
                },
                "they": {
                    "translation": "هم"
                },
                "thick": {
                    "translation": "سميك"
                },
                "thin": {
                    "translation": "نحيف"
                },
                "thing": {
                    "translation": "شيء"
                },
                "think": {
                    "translation": "يفكر"
                },
                "third": {
                    "translation": "ثالث"
                },
                "thirsty": {
                    "translation": "عطشان"
                },
                "thirteen": {
                    "translation": "ثلاثة عشر"
                },
                "thirty": {
                    "translation": "ثلاثون"
                },
                "this": {
                    "translation": "هذا"
                },
                "thorn": {
                    "translation": "شوكة"
                },
                "those": {
                    "translation": "أولئك"
                },
                "though": {
                    "translation": "رغم"
                },
                "thought": {
                    "translation": "فكرة / فكر"
                },
                "thousand": {
                    "translation": "ألف"
                },
                "thread": {
                    "translation": "خيط"
                },
                "threat": {
                    "translation": "تهديد"
                },
                "three": {
                    "translation": "ثلاثة"
                },
                "through": {
                    "translation": "عبر / من خلال"
                },
                "throughout": {
                    "translation": "خلال / في جميع أنحاء"
                },
                "throw": {
                    "translation": "يرمي"
                },
                "thunder": {
                    "translation": "رعد"
                },
                "thursday": {
                    "translation": "الخميس"
                },
                "thus": {
                    "translation": "وبالتالي"
                },
                "ticket": {
                    "translation": "تذكرة"
                },
                "tide": {
                    "translation": "مد وجزر"
                },
                "tidy": {
                    "translation": "يرتب"
                },
                "time": {
                    "translation": "وقت"
                },
                "tin": {
                    "translation": "علبة"
                },
                "tired": {
                    "translation": "متعب"
                },
                "title": {
                    "translation": "عنوان"
                },
                "to": {
                    "translation": "إلى"
                },
                "today": {
                    "translation": "اليوم"
                },
                "together": {
                    "translation": "معاً"
                },
                "tomato": {
                    "translation": "طماطم"
                },
                "tomorrow": {
                    "translation": "غدًا"
                },
                "tongue": {
                    "translation": "لسان"
                },
                "tonight": {
                    "translation": "الليلة"
                },
                "too": {
                    "translation": "أيضاً / أكثر من اللازم"
                },
                "tool": {
                    "translation": "أداة"
                },
                "tooth": {
                    "translation": "سن"
                },
                "toothbrush": {
                    "translation": "فرشاة أسنان"
                },
                "top": {
                    "translation": "أعلى / قمة"
                },
                "topic": {
                    "translation": "موضوع"
                },
                "tornado": {
                    "translation": "إعصار قمعي"
                },
                "toss": {
                    "translation": "يرمي"
                },
                "total": {
                    "translation": "إجمالي"
                },
                "touch": {
                    "translation": "يلمس"
                },
                "toward": {
                    "translation": "نحو"
                },
                "towel": {
                    "translation": "منشفة"
                },
                "tower": {
                    "translation": "برج"
                },
                "town": {
                    "translation": "بلدة"
                },
                "toy": {
                    "translation": "لعبة أطفال"
                },
                "track": {
                    "translation": "مسار"
                },
                "trade": {
                    "translation": "تجارة"
                },
                "traditional": {
                    "translation": "تقليدي"
                },
                "traditions": {
                    "translation": "تقاليد"
                },
                "traffic": {
                    "translation": "مرور"
                },
                "tragedy": {
                    "translation": "مأساة"
                },
                "trail": {
                    "translation": "أثر"
                },
                "train": {
                    "translation": "يدرّب"
                },
                "training": {
                    "translation": "تدريب"
                },
                "transfer": {
                    "translation": "نقل"
                },
                "transition": {
                    "translation": "انتقال"
                },
                "translate": {
                    "translation": "يترجم"
                },
                "translation": {
                    "translation": "ترجمة"
                },
                "transport": {
                    "translation": "ينقل"
                },
                "travel": {
                    "translation": "يسافر"
                },
                "tray": {
                    "translation": "صينية"
                },
                "treat": {
                    "translation": "يعالج"
                },
                "treatment": {
                    "translation": "علاج"
                },
                "tree": {
                    "translation": "شجرة"
                },
                "tremble": {
                    "translation": "يرتجف"
                },
                "trial": {
                    "translation": "محاكمة / تجربة"
                },
                "triangle": {
                    "translation": "مثلث"
                },
                "trip": {
                    "translation": "رحلة"
                },
                "trouble": {
                    "translation": "مشكلة"
                },
                "true": {
                    "translation": "صحيح"
                },
                "trunk": {
                    "translation": "جذع"
                },
                "trust": {
                    "translation": "يثق"
                },
                "truth": {
                    "translation": "حقيقة"
                },
                "try": {
                    "translation": "يحاول"
                },
                "tuesday": {
                    "translation": "الثلاثاء"
                },
                "turn": {
                    "translation": "يلتفت / يتحول / دور"
                },
                "TV": {
                    "translation": "تلفزيون"
                },
                "twelve": {
                    "translation": "اثنا عشر"
                },
                "twenty": {
                    "translation": "عشرون"
                },
                "two": {
                    "translation": "اثنان"
                },
                "type": {
                    "translation": "نوع / يكتب"
                },
                "ugly": {
                    "translation": "قبيح"
                },
                "umbrella": {
                    "translation": "مظلة"
                },
                "uncle": {
                    "translation": "عم / خال"
                },
                "under": {
                    "translation": "تحت"
                },
                "understand": {
                    "translation": "يفهم"
                },
                "unexpected": {
                    "translation": "غير متوقع"
                },
                "unfair": {
                    "translation": "جائر"
                },
                "unfamiliar": {
                    "translation": "غير مألوف"
                },
                "unit": {
                    "translation": "وحدة"
                },
                "universe": {
                    "translation": "كون"
                },
                "university": {
                    "translation": "جامعة"
                },
                "unless": {
                    "translation": "إلا إذا"
                },
                "until": {
                    "translation": "حتى"
                },
                "up": {
                    "translation": "فوق"
                },
                "upon": {
                    "translation": "على"
                },
                "us": {
                    "translation": "نحن (مفعول)"
                },
                "use": {
                    "translation": "يستخدم"
                },
                "useful": {
                    "translation": "مفيد"
                },
                "useless": {
                    "translation": "عديم الفائدة"
                },
                "user": {
                    "translation": "مستخدم"
                },
                "usual": {
                    "translation": "معتاد"
                },
                "usually": {
                    "translation": "عادة"
                },
                "validate": {
                    "translation": "يصادق"
                },
                "valley": {
                    "translation": "وادٍ"
                },
                "valuable": {
                    "translation": "قيم"
                },
                "value": {
                    "translation": "قيمة"
                },
                "vanish": {
                    "translation": "يتلاشى"
                },
                "variety": {
                    "translation": "تنوع"
                },
                "various": {
                    "translation": "مختلف"
                },
                "vary": {
                    "translation": "يتفاوت"
                },
                "vegetable": {
                    "translation": "خضار"
                },
                "vehicle": {
                    "translation": "مركبة"
                },
                "verify": {
                    "translation": "يتحقق"
                },
                "version": {
                    "translation": "نسخة"
                },
                "very": {
                    "translation": "جدا"
                },
                "via": {
                    "translation": "عن طريق"
                },
                "victim": {
                    "translation": "ضحية"
                },
                "victory": {
                    "translation": "نصر"
                },
                "video": {
                    "translation": "فيديو"
                },
                "view": {
                    "translation": "منظر / رأي"
                },
                "village": {
                    "translation": "قرية"
                },
                "vineyard": {
                    "translation": "كرم"
                },
                "violence": {
                    "translation": "عنف"
                },
                "vision": {
                    "translation": "رؤية"
                },
                "visit": {
                    "translation": "زيارة / يزور"
                },
                "voice": {
                    "translation": "صوت"
                },
                "volume": {
                    "translation": "حجم"
                },
                "vote": {
                    "translation": "تصويت"
                },
                "wage": {
                    "translation": "أجر"
                },
                "wait": {
                    "translation": "ينتظر"
                },
                "waking": {
                    "translation": "استيقاظ"
                },
                "walk": {
                    "translation": "يمشي"
                },
                "wall": {
                    "translation": "جدار"
                },
                "wallet": {
                    "translation": "محفظة"
                },
                "want": {
                    "translation": "يريد"
                },
                "war": {
                    "translation": "حرب"
                },
                "warm": {
                    "translation": "دافئ"
                },
                "warmth": {
                    "translation": "دفء"
                },
                "warn": {
                    "translation": "يحذر"
                },
                "warning": {
                    "translation": "تحذير"
                },
                "wash": {
                    "translation": "يغسل"
                },
                "waste": {
                    "translation": "يهدر"
                },
                "watch": {
                    "translation": "يشاهد / ساعة"
                },
                "water": {
                    "translation": "ماء"
                },
                "wave": {
                    "translation": "موجة"
                },
                "waves": {
                    "translation": "أمواج"
                },
                "way": {
                    "translation": "طريق / طريقة"
                },
                "we": {
                    "translation": "نحن"
                },
                "weak": {
                    "translation": "ضعيف"
                },
                "weapon": {
                    "translation": "سلاح"
                },
                "wear": {
                    "translation": "يرتدي"
                },
                "weather": {
                    "translation": "طقس"
                },
                "wedding": {
                    "translation": "زفاف"
                },
                "wednesday": {
                    "translation": "الأربعاء"
                },
                "weed": {
                    "translation": "عشب ضار"
                },
                "week": {
                    "translation": "أسبوع"
                },
                "weekend": {
                    "translation": "عطلة نهاية الأسبوع"
                },
                "weight": {
                    "translation": "وزن"
                },
                "welcome": {
                    "translation": "ترحيب"
                },
                "welcomed": {
                    "translation": "رحب"
                },
                "welder": {
                    "translation": "لحّام"
                },
                "welfare": {
                    "translation": "رفاهية"
                },
                "well": {
                    "translation": "جيداً / حسناً"
                },
                "went": {
                    "translation": "ذهب"
                },
                "west": {
                    "translation": "غرب"
                },
                "wet": {
                    "translation": "مبلل"
                },
                "what": {
                    "translation": "ماذا"
                },
                "whatever": {
                    "translation": "أي شيء"
                },
                "wheel": {
                    "translation": "عجلة"
                },
                "when": {
                    "translation": "متى"
                },
                "whenever": {
                    "translation": "متى ما"
                },
                "where": {
                    "translation": "حيث"
                },
                "whereas": {
                    "translation": "بينما"
                },
                "wherever": {
                    "translation": "أينما"
                },
                "whether": {
                    "translation": "سواء"
                },
                "which": {
                    "translation": "أيّ / الذي"
                },
                "whichever": {
                    "translation": "أيهما"
                },
                "while": {
                    "translation": "بينما / فترة"
                },
                "whisper": {
                    "translation": "يهمس"
                },
                "white": {
                    "translation": "أبيض"
                },
                "who": {
                    "translation": "من"
                },
                "whoever": {
                    "translation": "أي شخص"
                },
                "whole": {
                    "translation": "كامل"
                },
                "whom": {
                    "translation": "مَن"
                },
                "whose": {
                    "translation": "الذي"
                },
                "why": {
                    "translation": "لماذا"
                },
                "wide": {
                    "translation": "واسع"
                },
                "width": {
                    "translation": "عرض"
                },
                "wife": {
                    "translation": "زوجة"
                },
                "will": {
                    "translation": "سوف"
                },
                "win": {
                    "translation": "يفوز"
                },
                "wind": {
                    "translation": "ريح"
                },
                "window": {
                    "translation": "نافذة"
                },
                "wing": {
                    "translation": "جناح"
                },
                "winner": {
                    "translation": "الفائز"
                },
                "winter": {
                    "translation": "شتاء"
                },
                "wire": {
                    "translation": "سلك"
                },
                "wisdom": {
                    "translation": "حكمة"
                },
                "wish": {
                    "translation": "يتمنى"
                },
                "with": {
                    "translation": "مع"
                },
                "within": {
                    "translation": "داخل"
                },
                "without": {
                    "translation": "بدون"
                },
                "witness": {
                    "translation": "شاهد"
                },
                "woke": {
                    "translation": "استيقظ"
                },
                "woman": {
                    "translation": "امرأة"
                },
                "wonder": {
                    "translation": "يتساءل / عجيب"
                },
                "wood": {
                    "translation": "خشب"
                },
                "wool": {
                    "translation": "صوف"
                },
                "word": {
                    "translation": "كلمة"
                },
                "work": {
                    "translation": "عمل / يعمل"
                },
                "worker": {
                    "translation": "عامل"
                },
                "world": {
                    "translation": "عالم"
                },
                "worry": {
                    "translation": "قلق / يقلق"
                },
                "worth": {
                    "translation": "قيمة"
                },
                "would": {
                    "translation": "سوف (ماضي will)"
                },
                "write": {
                    "translation": "يكتب"
                },
                "writer": {
                    "translation": "كاتب"
                },
                "wrong": {
                    "translation": "خطأ"
                },
                "yeah": {
                    "translation": "نعم"
                },
                "year": {
                    "translation": "سنة"
                },
                "yellow": {
                    "translation": "أصفر"
                },
                "yes": {
                    "translation": "نعم"
                },
                "yesterday": {
                    "translation": "أمس"
                },
                "yet": {
                    "translation": "بعد / مع ذلك"
                },
                "you": {
                    "translation": "أنت"
                },
                "young": {
                    "translation": "صغير السن"
                },
                "your": {
                    "translation": "خاصتك"
                },
                "yours": {
                    "translation": "خاصتك"
                },
                "yourself": {
                    "translation": "نفسك"
                },
                "youth": {
                    "translation": "شباب"
                },
                "zipper": {
                    "translation": "سحّاب"
                },
                "zone": {
                    "translation": "منطقة"
                },
                "are": {
                    "translation": "يكونون / موجودون"
                },
                "brass": {
                    "translation": "نحاسي"
                },
                "click": {
                    "translation": "طقطقة / نقر"
                },
                "covered": {
                    "translation": "مغطى"
                },
                "found": {
                    "translation": "وجد"
                },
                "held": {
                    "translation": "احتوى / أمسك"
                },
                "letters": {
                    "translation": "رسائل"
                },
                "lid": {
                    "translation": "غطاء"
                },
                "lifted": {
                    "translation": "ارتفع"
                },
                "maya": {
                    "translation": "مايا"
                },
                "memories": {
                    "translation": "ذكريات"
                },
                "none": {
                    "translation": "لا شيء"
                },
                "oak": {
                    "translation": "بلوط"
                },
                "photograph": {
                    "translation": "صورة"
                },
                "pointed": {
                    "translation": "أشار"
                },
                "realized": {
                    "translation": "أدرك"
                },
                "scratches": {
                    "translation": "خدوش"
                },
                "shed": {
                    "translation": "سقيفة"
                },
                "shelf": {
                    "translation": "رف"
                },
                "smiled": {
                    "translation": "ابتسم"
                },
                "tiny": {
                    "translation": "صغير جدًا"
                },
                "treasures": {
                    "translation": "كنوز"
                },
                "tried": {
                    "translation": "جرّب"
                },
                "turned": {
                    "translation": "دار"
                },
                "waited": {
                    "translation": "انتظر"
                },
                "was": {
                    "translation": "كان"
                },
                "wooden": {
                    "translation": "خشبي"
                }
            },
            "fr": {
                "a": {
                    "translation": "يملك"
                },
                "abeille": {
                    "translation": "نحلة"
                },
                "abri": {
                    "translation": "مأوى"
                },
                "absent": {
                    "translation": "غائب"
                },
                "abîme": {
                    "translation": "هاوية"
                },
                "abîmer": {
                    "translation": "يتلف"
                },
                "accepter": {
                    "translation": "يقبل"
                },
                "accompagner": {
                    "translation": "يرافق"
                },
                "accorder": {
                    "translation": "يمنح"
                },
                "accuser": {
                    "translation": "يتهم"
                },
                "accéder": {
                    "translation": "يصل"
                },
                "acheter": {
                    "translation": "يشتري"
                },
                "acquérir": {
                    "translation": "يكتسب"
                },
                "acteur": {
                    "translation": "ممثل"
                },
                "action": {
                    "translation": "فعل"
                },
                "activité": {
                    "translation": "نشاط"
                },
                "admirer": {
                    "translation": "يعجب بـ"
                },
                "adorer": {
                    "translation": "يعبد"
                },
                "adroit": {
                    "translation": "ماهر"
                },
                "affaire": {
                    "translation": "أمر"
                },
                "affamé": {
                    "translation": "جائع"
                },
                "affecter": {
                    "translation": "يخصّص"
                },
                "afficher": {
                    "translation": "يعرض"
                },
                "affirmer": {
                    "translation": "يؤكد"
                },
                "agaçant": {
                    "translation": "مزعج"
                },
                "agir": {
                    "translation": "يتصرف"
                },
                "agiter": {
                    "translation": "يهز"
                },
                "ai": {
                    "translation": "أملك"
                },
                "aide": {
                    "translation": "تساعد"
                },
                "aider": {
                    "translation": "يساعد"
                },
                "aideront": {
                    "translation": "ستساعد"
                },
                "aiguille": {
                    "translation": "إبرة"
                },
                "ail": {
                    "translation": "ثوم"
                },
                "ailleurs": {
                    "translation": "في مكان آخر"
                },
                "aimable": {
                    "translation": "لطيف"
                },
                "aimer": {
                    "translation": "يحب"
                },
                "ainsi": {
                    "translation": "هكذا"
                },
                "air": {
                    "translation": "هواء"
                },
                "alerte": {
                    "translation": "إنذار"
                },
                "aligner": {
                    "translation": "يصف"
                },
                "aliment": {
                    "translation": "طعام"
                },
                "allant": {
                    "translation": "تذهب"
                },
                "aller": {
                    "translation": "يذهب"
                },
                "allouer": {
                    "translation": "يُخصّص"
                },
                "allumer": {
                    "translation": "يشعل"
                },
                "allée": {
                    "translation": "ممر أشجار"
                },
                "alors": {
                    "translation": "إذن"
                },
                "amande": {
                    "translation": "لوز"
                },
                "amener": {
                    "translation": "يجلب"
                },
                "amer": {
                    "translation": "مرّ"
                },
                "ami": {
                    "translation": "صديق"
                },
                "amitié": {
                    "translation": "صداقة"
                },
                "ammar": {
                    "translation": "عمار"
                },
                "amour": {
                    "translation": "حرب / حب"
                },
                "amphithéâتر": {
                    "translation": "مدرّج"
                },
                "ample": {
                    "translation": "واسع"
                },
                "amusante": {
                    "translation": "ممتعة"
                },
                "amuser": {
                    "translation": "يسلّي"
                },
                "améliorer": {
                    "translation": "تحسن"
                },
                "an": {
                    "translation": "سنة"
                },
                "analyse": {
                    "translation": "تحليل"
                },
                "analyser": {
                    "translation": "يحلل"
                },
                "ananas": {
                    "translation": "أناناس"
                },
                "ancien": {
                    "translation": "قديم"
                },
                "ancre": {
                    "translation": "مرساة"
                },
                "ancêtre": {
                    "translation": "سلف"
                },
                "angle": {
                    "translation": "زاوية"
                },
                "angoisse": {
                    "translation": "هلع"
                },
                "animal": {
                    "translation": "حيوان"
                },
                "animer": {
                    "translation": "ينشّط"
                },
                "animé": {
                    "translation": "متحمس"
                },
                "annexe": {
                    "translation": "ملحق"
                },
                "annoncer": {
                    "translation": "يعلن"
                },
                "annuel": {
                    "translation": "سنوي"
                },
                "année": {
                    "translation": "سنة"
                },
                "anonyme": {
                    "translation": "مجهول"
                },
                "anxieux": {
                    "translation": "قلق"
                },
                "août": {
                    "translation": "أغسطس"
                },
                "apaiser": {
                    "translation": "يهدّئ"
                },
                "apercevoir": {
                    "translation": "يلمح"
                },
                "appareil": {
                    "translation": "جهاز"
                },
                "appartenir": {
                    "translation": "ينتمي"
                },
                "appeler": {
                    "translation": "ينادي"
                },
                "apporter": {
                    "translation": "يجلب"
                },
                "apprendre": {
                    "translation": "يتعلم"
                },
                "appris": {
                    "translation": "تعلَّمَ / عَرَفَ"
                },
                "appui": {
                    "translation": "مسند"
                },
                "appuyer": {
                    "translation": "يضغط"
                },
                "appétit": {
                    "translation": "شهية"
                },
                "après": {
                    "translation": "بعد"
                },
                "après-midi": {
                    "translation": "بعد الظهر"
                },
                "araignée": {
                    "translation": "عنكبوت"
                },
                "arbre": {
                    "translation": "شجرة"
                },
                "arc-en-ciel": {
                    "translation": "قوس قزح"
                },
                "ardoise": {
                    "translation": "أردواز"
                },
                "argent": {
                    "translation": "مال"
                },
                "argenté": {
                    "translation": "فضي"
                },
                "armure": {
                    "translation": "درع"
                },
                "arpent": {
                    "translation": "مِنّة"
                },
                "arracher": {
                    "translation": "ينتزع"
                },
                "arrachée": {
                    "translation": "انتزاع"
                },
                "arriver": {
                    "translation": "يصل"
                },
                "arrogant": {
                    "translation": "متعجرف"
                },
                "arrosoir": {
                    "translation": "إبريق ريّ"
                },
                "arrêt": {
                    "translation": "موقف"
                },
                "arrêter": {
                    "translation": "يتوقف"
                },
                "art": {
                    "translation": "فن"
                },
                "artisan": {
                    "translation": "حرفي"
                },
                "arête": {
                    "translation": "نصل"
                },
                "as": {
                    "translation": "تملك"
                },
                "ascenseur": {
                    "translation": "مصعد"
                },
                "ascension": {
                    "translation": "صعود"
                },
                "aspirateur": {
                    "translation": "مكنسة كهربائية"
                },
                "aspirer": {
                    "translation": "يسحب"
                },
                "assidu": {
                    "translation": "مثابر"
                },
                "assiette": {
                    "translation": "طبق"
                },
                "assure": {
                    "translation": "تضمن"
                },
                "assurer": {
                    "translation": "يضمن"
                },
                "atelier": {
                    "translation": "ورشة"
                },
                "atlas": {
                    "translation": "أطلس"
                },
                "attacher": {
                    "translation": "يربط"
                },
                "attaque": {
                    "translation": "هجوم"
                },
                "attaquer": {
                    "translation": "يهاجم"
                },
                "atteindre": {
                    "translation": "بلوغ / تحقيق"
                },
                "attelage": {
                    "translation": "جرّ"
                },
                "attendre": {
                    "translation": "ينتظر"
                },
                "attention": {
                    "translation": "انتباه"
                },
                "attribuer": {
                    "translation": "ينسب"
                },
                "attrister": {
                    "translation": "يحزن"
                },
                "au": {
                    "translation": "للـ"
                },
                "au revoir": {
                    "translation": "وداعًا"
                },
                "aube": {
                    "translation": "فجر"
                },
                "auberge": {
                    "translation": "خان"
                },
                "aubier": {
                    "translation": "لب خشب"
                },
                "auge": {
                    "translation": "مذود"
                },
                "augmenter": {
                    "translation": "يزيد"
                },
                "aujourd'hui": {
                    "translation": "اليوم"
                },
                "aurore": {
                    "translation": "شروق"
                },
                "aussi": {
                    "translation": "أيضا"
                },
                "auteur": {
                    "translation": "مؤلف"
                },
                "authentique": {
                    "translation": "أصيل"
                },
                "automne": {
                    "translation": "خريف"
                },
                "autorisr": {
                    "translation": "يسمح"
                },
                "autre": {
                    "translation": "آخر"
                },
                "aux": {
                    "translation": "للـ (جمع)"
                },
                "avait": {
                    "translation": "كان يملك"
                },
                "avancer": {
                    "translation": "يتقدم"
                },
                "avancé": {
                    "translation": "متقدم"
                },
                "avant": {
                    "translation": "قبل"
                },
                "avantage": {
                    "translation": "ميزة"
                },
                "avare": {
                    "translation": "بخيل"
                },
                "avec": {
                    "translation": "مع"
                },
                "aventures": {
                    "translation": "مغامرات"
                },
                "avenue": {
                    "translation": "جادة"
                },
                "averse": {
                    "translation": "مطر غزير"
                },
                "avertir": {
                    "translation": "يحذر"
                },
                "aveugle": {
                    "translation": "أعمى"
                },
                "avion": {
                    "translation": "طائرة"
                },
                "avocat": {
                    "translation": "محامٍ"
                },
                "avoine": {
                    "translation": "شوفان"
                },
                "avoir": {
                    "translation": "يملك"
                },
                "avouer": {
                    "translation": "يعترف"
                },
                "avril": {
                    "translation": "أبريل"
                },
                "aéroport": {
                    "translation": "مطار"
                },
                "baccalauréat": {
                    "translation": "شهادة الثانوية"
                },
                "badigeon": {
                    "translation": "طلاء جيري"
                },
                "bague": {
                    "translation": "خاتم"
                },
                "baguette": {
                    "translation": "عصا صغيرة"
                },
                "bain": {
                    "translation": "حمّام"
                },
                "balade": {
                    "translation": "جولة"
                },
                "balayer": {
                    "translation": "يكنس"
                },
                "baleine": {
                    "translation": "حوت"
                },
                "balle": {
                    "translation": "كرة"
                },
                "bambou": {
                    "translation": "خيزران"
                },
                "banane": {
                    "translation": "موزة"
                },
                "bananier": {
                    "translation": "شجرة موز"
                },
                "banc": {
                    "translation": "مقعد حديقة"
                },
                "bande": {
                    "translation": "شريط"
                },
                "bandoulière": {
                    "translation": "حزام عبّاء"
                },
                "banque": {
                    "translation": "مصرف"
                },
                "banquette": {
                    "translation": "مقعد طويل"
                },
                "barque": {
                    "translation": "قارب صغير"
                },
                "barrage": {
                    "translation": "سدّ"
                },
                "barre": {
                    "translation": "عصا"
                },
                "bas": {
                    "translation": "قاع"
                },
                "bassin": {
                    "translation": "حوض"
                },
                "bateau": {
                    "translation": "سفينة"
                },
                "bavard": {
                    "translation": "ثرثار"
                },
                "baye": {
                    "translation": "خليج"
                },
                "beau": {
                    "translation": "جميل"
                },
                "besoin": {
                    "translation": "حاجة"
                },
                "bestial": {
                    "translation": "حيواني"
                },
                "beurre": {
                    "translation": "زبدة"
                },
                "bibliothèque": {
                    "translation": "مكتبة"
                },
                "bidon": {
                    "translation": "جرّة"
                },
                "bien": {
                    "translation": "جيدا"
                },
                "bientôt": {
                    "translation": "قريبا"
                },
                "bienvenue": {
                    "translation": "أهلاً"
                },
                "bijou": {
                    "translation": "جوهرة"
                },
                "bilan": {
                    "translation": "حصيلة"
                },
                "biologie": {
                    "translation": "أحياء"
                },
                "biscuit": {
                    "translation": "بسكويت"
                },
                "bière": {
                    "translation": "جعة"
                },
                "blanc": {
                    "translation": "أبيض"
                },
                "blason": {
                    "translation": "شعار نبيل"
                },
                "bled": {
                    "translation": "بلدة"
                },
                "blesser": {
                    "translation": "يجرح"
                },
                "blessure": {
                    "translation": "إصابة"
                },
                "bleu": {
                    "translation": "أزرق"
                },
                "bloquer": {
                    "translation": "يحجب"
                },
                "blâmer": {
                    "translation": "يلوم"
                },
                "blé": {
                    "translation": "قمح"
                },
                "bobine": {
                    "translation": "بكرة"
                },
                "bocal": {
                    "translation": "برطمان"
                },
                "bois": {
                    "translation": "خشب"
                },
                "boisson": {
                    "translation": "مشروب"
                },
                "bol": {
                    "translation": "زبدية"
                },
                "bonbon": {
                    "translation": "حلوى"
                },
                "bond": {
                    "translation": "قفزة"
                },
                "bonheur": {
                    "translation": "سعادة"
                },
                "bonjour": {
                    "translation": "مرحبًا"
                },
                "bonne nuit": {
                    "translation": "تصبح على خير"
                },
                "bonsoir": {
                    "translation": "مساء الخير"
                },
                "bord": {
                    "translation": "حافة"
                },
                "botte": {
                    "translation": "حذاء طويل"
                },
                "bouche": {
                    "translation": "فم"
                },
                "boucher": {
                    "translation": "جزار"
                },
                "boucle": {
                    "translation": "دبوس"
                },
                "boue": {
                    "translation": "طين"
                },
                "bougie": {
                    "translation": "شمعة"
                },
                "bouilloire": {
                    "translation": "غلاية"
                },
                "boulanger": {
                    "translation": "خباز"
                },
                "boulet": {
                    "translation": "قذيفة"
                },
                "boulevard": {
                    "translation": "شارع عريض"
                },
                "bouquet": {
                    "translation": "باقة زهر"
                },
                "bout": {
                    "translation": "طرف"
                },
                "bouteille": {
                    "translation": "زجاجة"
                },
                "bouton": {
                    "translation": "زر"
                },
                "boîte": {
                    "translation": "صندوق"
                },
                "bracelet": {
                    "translation": "سوار"
                },
                "braise": {
                    "translation": "جمر"
                },
                "bras": {
                    "translation": "ذراع"
                },
                "bravo": {
                    "translation": "أحسنت"
                },
                "briller": {
                    "translation": "يلمع"
                },
                "brindille": {
                    "translation": "غصن صغير"
                },
                "brise": {
                    "translation": "نسيم"
                },
                "briser": {
                    "translation": "يكسر"
                },
                "broderie": {
                    "translation": "تطريز"
                },
                "brosse": {
                    "translation": "فرشاة"
                },
                "brouillard": {
                    "translation": "ضباب"
                },
                "bruit": {
                    "translation": "ضوضاء"
                },
                "brume": {
                    "translation": "ضباب خفيف"
                },
                "brutal": {
                    "translation": "وحشي"
                },
                "bruyant": {
                    "translation": "صاخب"
                },
                "bruyère": {
                    "translation": "متلّج"
                },
                "brûler": {
                    "translation": "يحرق"
                },
                "buisson": {
                    "translation": "شجيرة"
                },
                "bulle": {
                    "translation": "فقاعة"
                },
                "bureau": {
                    "translation": "مكتب"
                },
                "bus": {
                    "translation": "حافلة"
                },
                "but": {
                    "translation": "هدف"
                },
                "butin": {
                    "translation": "غنائم"
                },
                "bâtir": {
                    "translation": "يبني"
                },
                "bébé": {
                    "translation": "رضيع"
                },
                "bénéfice": {
                    "translation": "فائدة"
                },
                "cabinet": {
                    "translation": "عيادة"
                },
                "cacher": {
                    "translation": "يخبّي"
                },
                "cadeau": {
                    "translation": "هدية"
                },
                "cadran": {
                    "translation": "قرص ساعة"
                },
                "cadre": {
                    "translation": "إطار"
                },
                "café": {
                    "translation": "قهوة"
                },
                "cahier": {
                    "translation": "دفتر"
                },
                "caisse": {
                    "translation": "صندوق"
                },
                "calcin": {
                    "translation": "رماد"
                },
                "calculer": {
                    "translation": "يحسب"
                },
                "cale": {
                    "translation": "مقطع سفينة"
                },
                "calme": {
                    "translation": "سكون"
                },
                "camion": {
                    "translation": "شاحنة"
                },
                "canal": {
                    "translation": "مجراة"
                },
                "canapé": {
                    "translation": "أريكة"
                },
                "canard": {
                    "translation": "بطّة"
                },
                "candidature": {
                    "translation": "ترشيح"
                },
                "canif": {
                    "translation": "مِبرد"
                },
                "capable": {
                    "translation": "قادر"
                },
                "capacité": {
                    "translation": "قدرة"
                },
                "capitaine": {
                    "translation": "قبطان"
                },
                "captaine": {
                    "translation": "رئيسي"
                },
                "car": {
                    "translation": "لأن"
                },
                "caravane": {
                    "translation": "قافلة"
                },
                "carburant": {
                    "translation": "وقود"
                },
                "carotte": {
                    "translation": "جزر"
                },
                "carreau": {
                    "translation": "بلاطة"
                },
                "carrefour": {
                    "translation": "تقاطع"
                },
                "carré": {
                    "translation": "مربع"
                },
                "cartable": {
                    "translation": "حقيبة مدرسية"
                },
                "carte": {
                    "translation": "خريطة"
                },
                "cas": {
                    "translation": "حالة"
                },
                "cascade": {
                    "translation": "شلال"
                },
                "casier": {
                    "translation": "خزانة صغيرة"
                },
                "casque": {
                    "translation": "خوذة"
                },
                "cassant": {
                    "translation": "هش"
                },
                "casse": {
                    "translation": "كسر"
                },
                "casser": {
                    "translation": "يكسر"
                },
                "casserole": {
                    "translation": "مقلاة"
                },
                "castle": {
                    "translation": "قلعة"
                },
                "catalogue": {
                    "translation": "كتالوج"
                },
                "cathédrale": {
                    "translation": "كاتدرائية"
                },
                "cauchemar": {
                    "translation": "كابوس"
                },
                "causer": {
                    "translation": "يسبب"
                },
                "cave": {
                    "translation": "قبو"
                },
                "caverne": {
                    "translation": "كهف"
                },
                "ce": {
                    "translation": "هذا"
                },
                "ceinture": {
                    "translation": "حزام"
                },
                "celle": {
                    "translation": "تلك"
                },
                "cellophane": {
                    "translation": "ورق شفاف"
                },
                "celui": {
                    "translation": "ذلك"
                },
                "cendre": {
                    "translation": "رماد"
                },
                "cent": {
                    "translation": "مائة"
                },
                "centaine": {
                    "translation": "مئة"
                },
                "centimètre": {
                    "translation": "سنتيمتر"
                },
                "cependant": {
                    "translation": "غير أن"
                },
                "cercle": {
                    "translation": "دائرة"
                },
                "cercueil": {
                    "translation": "نعش"
                },
                "cerf": {
                    "translation": "أيل"
                },
                "cerise": {
                    "translation": "كرز"
                },
                "certain": {
                    "translation": "معيّن"
                },
                "cerveau": {
                    "translation": "مخ"
                },
                "ces": {
                    "translation": "هؤلاء"
                },
                "cet": {
                    "translation": "هذا (قبل معتل)"
                },
                "cette": {
                    "translation": "هذه"
                },
                "ceux": {
                    "translation": "أولئك"
                },
                "chacal": {
                    "translation": "شقل"
                },
                "chacun": {
                    "translation": "كل واحد"
                },
                "chagrin": {
                    "translation": "حزن"
                },
                "chaise": {
                    "translation": "كرسي"
                },
                "chaleur": {
                    "translation": "حرارة"
                },
                "chambre": {
                    "translation": "غرفة نوم"
                },
                "champ": {
                    "translation": "حقل"
                },
                "chandelle": {
                    "translation": "شمعة طويلة"
                },
                "changer": {
                    "translation": "يغير"
                },
                "chanson": {
                    "translation": "أغنية"
                },
                "chanter": {
                    "translation": "يغني"
                },
                "chanteur": {
                    "translation": "مغنٍّ"
                },
                "chantier": {
                    "translation": "موقع بناء"
                },
                "chapeau": {
                    "translation": "قبعة"
                },
                "chapelle": {
                    "translation": "مصلى"
                },
                "chaque": {
                    "translation": "كل"
                },
                "charge": {
                    "translation": "حمل"
                },
                "chariot": {
                    "translation": "عربة صغيرة"
                },
                "charmant": {
                    "translation": "ساحر"
                },
                "charrue": {
                    "translation": "محراث"
                },
                "chasse": {
                    "translation": "صيد"
                },
                "chat": {
                    "translation": "قطة"
                },
                "chaud": {
                    "translation": "حار"
                },
                "chaudron": {
                    "translation": "بوتّة"
                },
                "chauffeur": {
                    "translation": "سائق"
                },
                "chausson": {
                    "translation": "خفّ"
                },
                "chaussure": {
                    "translation": "حذاء"
                },
                "chauve": {
                    "translation": "أصلع"
                },
                "chaîne": {
                    "translation": "سلسلة"
                },
                "chemin": {
                    "translation": "مسار"
                },
                "cheminée": {
                    "translation": "مدفأة"
                },
                "chemise": {
                    "translation": "قميص"
                },
                "cher": {
                    "translation": "غالي"
                },
                "chercher": {
                    "translation": "يبحث"
                },
                "cheval": {
                    "translation": "حصان"
                },
                "chevalier": {
                    "translation": "فارس"
                },
                "cheveu": {
                    "translation": "شعر"
                },
                "chevreuil": {
                    "translation": "غزال"
                },
                "chic": {
                    "translation": "أنيق"
                },
                "chien": {
                    "translation": "كلب"
                },
                "chimie": {
                    "translation": "كيمياء"
                },
                "chiot": {
                    "translation": "جرو"
                },
                "chocolat": {
                    "translation": "شوكولاتة"
                },
                "choisi": {
                    "translation": "اختار"
                },
                "choisir": {
                    "translation": "يختار"
                },
                "choix": {
                    "translation": "اختيار"
                },
                "choppe": {
                    "translation": "كأس"
                },
                "chose": {
                    "translation": "شيء"
                },
                "chuchotement": {
                    "translation": "همس"
                },
                "chuchoter": {
                    "translation": "يهمس"
                },
                "chêne": {
                    "translation": "بلوط"
                },
                "cible": {
                    "translation": "هدف"
                },
                "ciel": {
                    "translation": "سماء"
                },
                "cigogne": {
                    "translation": "لقلق"
                },
                "cime": {
                    "translation": "ذروة"
                },
                "cinq": {
                    "translation": "خمسة"
                },
                "cinquante": {
                    "translation": "خمسون"
                },
                "cinquième": {
                    "translation": "خمسة أفيال"
                },
                "cinéma": {
                    "translation": "سينما"
                },
                "cirage": {
                    "translation": "ملصّق أحذية"
                },
                "cirque": {
                    "translation": "سيرك"
                },
                "ciseaux": {
                    "translation": "مقص"
                },
                "citer": {
                    "translation": "يذكر"
                },
                "citerne": {
                    "translation": "خزان مياه"
                },
                "citoyen": {
                    "translation": "مواطن"
                },
                "citoyenneté": {
                    "translation": "مواطنة"
                },
                "citron": {
                    "translation": "ليمون"
                },
                "clair": {
                    "translation": "واضح"
                },
                "claquer": {
                    "translation": "يصفق"
                },
                "clarté": {
                    "translation": "صفاء"
                },
                "classe": {
                    "translation": "صف"
                },
                "client": {
                    "translation": "زبون"
                },
                "climat": {
                    "translation": "جوّ"
                },
                "cliquer": {
                    "translation": "النقر"
                },
                "cliquez": {
                    "translation": "انقر"
                },
                "cloche": {
                    "translation": "جرس"
                },
                "clochette": {
                    "translation": "جرس صغير"
                },
                "clos": {
                    "translation": "مسيّج"
                },
                "clou": {
                    "translation": "مسمار"
                },
                "cloître": {
                    "translation": "صوامع"
                },
                "clé": {
                    "translation": "مفتاح"
                },
                "coccinelle": {
                    "translation": "دعسوقة"
                },
                "code": {
                    "translation": "شفرة"
                },
                "coffre": {
                    "translation": "صندوق الأمانات"
                },
                "cogner": {
                    "translation": "يطرق"
                },
                "coiffeur": {
                    "translation": "حلّاق"
                },
                "coin": {
                    "translation": "زاوية"
                },
                "colis": {
                    "translation": "طرد"
                },
                "collection": {
                    "translation": "مجموعة"
                },
                "collier": {
                    "translation": "قلادة"
                },
                "colline": {
                    "translation": "تل"
                },
                "collègue": {
                    "translation": "زميل"
                },
                "colombe": {
                    "translation": "حمامة"
                },
                "colossal": {
                    "translation": "هائل"
                },
                "colère": {
                    "translation": "غضب"
                },
                "combat": {
                    "translation": "قتال"
                },
                "combattre": {
                    "translation": "يقاتل"
                },
                "comble": {
                    "translation": "سقف"
                },
                "commande": {
                    "translation": "أمر شراء"
                },
                "commander": {
                    "translation": "يأمر"
                },
                "comme": {
                    "translation": "مثل"
                },
                "commencent": {
                    "translation": "يبدؤون"
                },
                "commencer": {
                    "translation": "يبدأ"
                },
                "comment": {
                    "translation": "كيف"
                },
                "commerce": {
                    "translation": "تجارة"
                },
                "commettre": {
                    "translation": "يرتكب"
                },
                "commun": {
                    "translation": "مشترك"
                },
                "commune": {
                    "translation": "بلدية"
                },
                "communiquer": {
                    "translation": "يتواصل"
                },
                "compact": {
                    "translation": "مدمج"
                },
                "compassion": {
                    "translation": "شفقة"
                },
                "compatible": {
                    "translation": "متوافق"
                },
                "compliment": {
                    "translation": "تهنئة"
                },
                "compléter": {
                    "translation": "يكمل"
                },
                "composer": {
                    "translation": "يؤلف"
                },
                "comprendre": {
                    "translation": "يفهم"
                },
                "comprenez": {
                    "translation": "تفهم"
                },
                "comprimer": {
                    "translation": "يضغط"
                },
                "comprimé": {
                    "translation": "قرص دواء"
                },
                "compréhension": {
                    "translation": "الفهم"
                },
                "compte": {
                    "translation": "حساب"
                },
                "compter": {
                    "translation": "يعد"
                },
                "comptine": {
                    "translation": "أغنية أطفال"
                },
                "comptoir": {
                    "translation": "طاولة عرض"
                },
                "compétence": {
                    "translation": "مهارة"
                },
                "compétences": {
                    "translation": "مهارات"
                },
                "compétent": {
                    "translation": "كفء"
                },
                "comète": {
                    "translation": "مذنب"
                },
                "concentration": {
                    "translation": "تركيز"
                },
                "concevoir": {
                    "translation": "يصمم"
                },
                "concis": {
                    "translation": "موجز"
                },
                "concombre": {
                    "translation": "خيار"
                },
                "concret": {
                    "translation": "ملموس"
                },
                "concurrent": {
                    "translation": "منافس"
                },
                "condamner": {
                    "translation": "يدين"
                },
                "conduire": {
                    "translation": "يقود"
                },
                "conduite": {
                    "translation": "قيادة"
                },
                "confiance": {
                    "translation": "ثقة"
                },
                "confiant": {
                    "translation": "واثق"
                },
                "confirmer": {
                    "translation": "يؤكد"
                },
                "confisquer": {
                    "translation": "يصادر"
                },
                "confiture": {
                    "translation": "مربى"
                },
                "conflit": {
                    "translation": "صراع"
                },
                "confort": {
                    "translation": "راحة"
                },
                "congé": {
                    "translation": "إجازة"
                },
                "connaissance": {
                    "translation": "معرفة"
                },
                "connaître": {
                    "translation": "يعرف"
                },
                "connecter": {
                    "translation": "يوصل"
                },
                "connivence": {
                    "translation": "تواطؤ"
                },
                "conquérir": {
                    "translation": "يغزو"
                },
                "conquête": {
                    "translation": "فتح"
                },
                "consacrer": {
                    "translation": "يكرّس"
                },
                "conscience": {
                    "translation": "ضمير"
                },
                "conscient": {
                    "translation": "واعٍ"
                },
                "conseil": {
                    "translation": "مشورة"
                },
                "conseiller": {
                    "translation": "يُرشد"
                },
                "consentement": {
                    "translation": "موافقة"
                },
                "consentir": {
                    "translation": "يوافق"
                },
                "conservateur": {
                    "translation": "محافظ"
                },
                "conserver": {
                    "translation": "يحفظ"
                },
                "considérer": {
                    "translation": "يعتبر"
                },
                "consister": {
                    "translation": "يتكون"
                },
                "console": {
                    "translation": "وحدة تحكّم"
                },
                "consoler": {
                    "translation": "يواسي"
                },
                "constant": {
                    "translation": "ثابت"
                },
                "constat": {
                    "translation": "ملاحظة"
                },
                "constater": {
                    "translation": "يلاحظ"
                },
                "constituer": {
                    "translation": "يشكّل"
                },
                "construire": {
                    "translation": "ينشئ"
                },
                "consulter": {
                    "translation": "يستشير"
                },
                "contact": {
                    "translation": "اتصال"
                },
                "contacter": {
                    "translation": "يتصل"
                },
                "conte": {
                    "translation": "حكاية"
                },
                "contenir": {
                    "translation": "يحتوي"
                },
                "contentement": {
                    "translation": "قناعة"
                },
                "contexte": {
                    "translation": "السياق"
                },
                "continuer": {
                    "translation": "يستمر"
                },
                "contradiction": {
                    "translation": "تناقض"
                },
                "contrat": {
                    "translation": "عقد"
                },
                "contribuer": {
                    "translation": "يساهم"
                },
                "contrôle": {
                    "translation": "رقابة"
                },
                "contrôler": {
                    "translation": "يتحكم"
                },
                "convenance": {
                    "translation": "لياقة"
                },
                "converser": {
                    "translation": "يتحادث"
                },
                "conçue": {
                    "translation": "مصممة"
                },
                "coordonner": {
                    "translation": "ينسّق"
                },
                "copier": {
                    "translation": "ينسخ"
                },
                "coq": {
                    "translation": "ديك"
                },
                "coran": {
                    "translation": "قرآن"
                },
                "corbeau": {
                    "translation": "غراب"
                },
                "corbeille": {
                    "translation": "سلّة"
                },
                "corde": {
                    "translation": "حبل"
                },
                "corne": {
                    "translation": "قرن"
                },
                "corps": {
                    "translation": "جسد"
                },
                "corpus": {
                    "translation": "متن"
                },
                "correct": {
                    "translation": "صحيح"
                },
                "correspondre": {
                    "translation": "يتطابق"
                },
                "corriger": {
                    "translation": "يصحّح"
                },
                "cosmos": {
                    "translation": "أثير"
                },
                "coton": {
                    "translation": "قطن"
                },
                "cou": {
                    "translation": "رقبة"
                },
                "couche": {
                    "translation": "طبقة"
                },
                "coucou": {
                    "translation": "أهلاً"
                },
                "coude": {
                    "translation": "كوع"
                },
                "couler": {
                    "translation": "يتدفّق"
                },
                "couleur": {
                    "translation": "لون"
                },
                "couloir": {
                    "translation": "ممر"
                },
                "coupable": {
                    "translation": "مذنب"
                },
                "coupe": {
                    "translation": "كأس"
                },
                "couper": {
                    "translation": "يقطع"
                },
                "couple": {
                    "translation": "زوج"
                },
                "cour": {
                    "translation": "فناء"
                },
                "courageux": {
                    "translation": "شجاع"
                },
                "courbe": {
                    "translation": "منحنى"
                },
                "courir": {
                    "translation": "يركض"
                },
                "cours": {
                    "translation": "درس"
                },
                "course": {
                    "translation": "سباق"
                },
                "court": {
                    "translation": "قصير"
                },
                "courtes": {
                    "translation": "قصيرة"
                },
                "courtois": {
                    "translation": "مؤدب"
                },
                "cousin": {
                    "translation": "ابن العم"
                },
                "couteau": {
                    "translation": "سكين"
                },
                "couture": {
                    "translation": "خياطة"
                },
                "couvercle": {
                    "translation": "غطاء"
                },
                "couvert": {
                    "translation": "مغطّى"
                },
                "couverture": {
                    "translation": "بطانية"
                },
                "couvrent": {
                    "translation": "تغطي"
                },
                "coût": {
                    "translation": "تكلفة"
                },
                "coûter": {
                    "translation": "يكلف"
                },
                "cracher": {
                    "translation": "يتفل"
                },
                "crainte": {
                    "translation": "وجل"
                },
                "crayon": {
                    "translation": "قلم رصاص"
                },
                "creuser": {
                    "translation": "يحفر"
                },
                "creux": {
                    "translation": "مجوف"
                },
                "crevasse": {
                    "translation": "شق"
                },
                "crevette": {
                    "translation": "جمبري"
                },
                "cri": {
                    "translation": "صراخ"
                },
                "cric": {
                    "translation": "رافعة صغيرة"
                },
                "critiquer": {
                    "translation": "ينتقد"
                },
                "croc": {
                    "translation": "ناب"
                },
                "croire": {
                    "translation": "يعتقد"
                },
                "croiser": {
                    "translation": "يعبر"
                },
                "croix": {
                    "translation": "صليب"
                },
                "cruche": {
                    "translation": "جرة كبيرة"
                },
                "crypte": {
                    "translation": "سرداب"
                },
                "crème": {
                    "translation": "قشدة"
                },
                "créatif": {
                    "translation": "مبدع"
                },
                "création": {
                    "translation": "إنجاز"
                },
                "crédit": {
                    "translation": "ائتمان"
                },
                "créer": {
                    "translation": "ينشئ"
                },
                "crépuscule": {
                    "translation": "شفق"
                },
                "créé": {
                    "translation": "إنشاؤه"
                },
                "cueillir": {
                    "translation": "يقطف"
                },
                "cuillère": {
                    "translation": "ملعقة"
                },
                "cuisine": {
                    "translation": "مطبخ"
                },
                "cuisiner": {
                    "translation": "يطبخ"
                },
                "cuisinier": {
                    "translation": "طباخ"
                },
                "culotte": {
                    "translation": "سروال"
                },
                "culpabilité": {
                    "translation": "ذنب"
                },
                "cultiver": {
                    "translation": "يزرع"
                },
                "culture": {
                    "translation": "حرث"
                },
                "curieux": {
                    "translation": "فضولي"
                },
                "cygne": {
                    "translation": "بجعة"
                },
                "cymbale": {
                    "translation": "صنج"
                },
                "câble": {
                    "translation": "كابل"
                },
                "célébrer": {
                    "translation": "يحتفل"
                },
                "côte": {
                    "translation": "ضِلع"
                },
                "côté": {
                    "translation": "جانب"
                },
                "cœur": {
                    "translation": "قلب"
                },
                "d'accord": {
                    "translation": "موافق"
                },
                "d'apprentissage": {
                    "translation": "التعلم"
                },
                "daim": {
                    "translation": "غزال أوروبي"
                },
                "dalle": {
                    "translation": "لوح"
                },
                "dangereux": {
                    "translation": "خطير"
                },
                "dans": {
                    "translation": "في"
                },
                "danser": {
                    "translation": "يرقص"
                },
                "danseur": {
                    "translation": "راقص"
                },
                "dauphin": {
                    "translation": "دلفين"
                },
                "davantage": {
                    "translation": "أكثر"
                },
                "de": {
                    "translation": "من"
                },
                "degré": {
                    "translation": "درجة"
                },
                "demain": {
                    "translation": "غدًا"
                },
                "demande": {
                    "translation": "مطالبة"
                },
                "demander": {
                    "translation": "يسأل"
                },
                "demi": {
                    "translation": "نصف"
                },
                "dense": {
                    "translation": "كثيف"
                },
                "dent": {
                    "translation": "سن"
                },
                "dentelle": {
                    "translation": "دانتيل"
                },
                "depuis": {
                    "translation": "منذ"
                },
                "dernier": {
                    "translation": "أخير"
                },
                "des": {
                    "translation": "من الـ (جمع)"
                },
                "descend": {
                    "translation": "ينزل"
                },
                "descendance": {
                    "translation": "ذرية"
                },
                "dessein": {
                    "translation": "قصد"
                },
                "dessin": {
                    "translation": "رسم"
                },
                "dette": {
                    "translation": "دينار"
                },
                "deux": {
                    "translation": "اثنان"
                },
                "deuxième": {
                    "translation": "ثاني"
                },
                "devant": {
                    "translation": "أمام"
                },
                "devanture": {
                    "translation": "واجهة"
                },
                "devenir": {
                    "translation": "يصبح"
                },
                "devise": {
                    "translation": "عملة"
                },
                "devoir": {
                    "translation": "يجب"
                },
                "dextérité": {
                    "translation": "براعة"
                },
                "diabète": {
                    "translation": "داء السكري"
                },
                "dialogue": {
                    "translation": "حوار"
                },
                "diamant": {
                    "translation": "ماس"
                },
                "diction": {
                    "translation": "نطق"
                },
                "dictionnaire": {
                    "translation": "قاموس"
                },
                "dictée": {
                    "translation": "إملاء"
                },
                "dieu": {
                    "translation": "إله"
                },
                "difficile": {
                    "translation": "صعب"
                },
                "diffuser": {
                    "translation": "يبث"
                },
                "différence": {
                    "translation": "فرق"
                },
                "différent": {
                    "translation": "مختلف"
                },
                "différents": {
                    "translation": "مختلفة"
                },
                "dignité": {
                    "translation": "كرامة"
                },
                "dilution": {
                    "translation": "تخفيف"
                },
                "dimanche": {
                    "translation": "الأحد"
                },
                "dimension": {
                    "translation": "بُعد"
                },
                "diminuer": {
                    "translation": "ينقص"
                },
                "diplôme": {
                    "translation": "شهادة"
                },
                "dire": {
                    "translation": "يقول"
                },
                "direct": {
                    "translation": "مباشر"
                },
                "direction": {
                    "translation": "اتجاه"
                },
                "dirigeant": {
                    "translation": "قائد"
                },
                "diriger": {
                    "translation": "يوجّه"
                },
                "discours": {
                    "translation": "خطاب"
                },
                "discret": {
                    "translation": "كتوم"
                },
                "discuter": {
                    "translation": "يناقش"
                },
                "disent": {
                    "translation": "يقولون"
                },
                "disparaître": {
                    "translation": "يختفي"
                },
                "disposer": {
                    "translation": "يتوفر"
                },
                "dispute": {
                    "translation": "شجار"
                },
                "distance": {
                    "translation": "مسافة"
                },
                "distinct": {
                    "translation": "مميز"
                },
                "distinction": {
                    "translation": "تمييز"
                },
                "distinguer": {
                    "translation": "يميز"
                },
                "distraction": {
                    "translation": "تسلية"
                },
                "distraire": {
                    "translation": "يشتّت"
                },
                "distribuer": {
                    "translation": "يوزّع"
                },
                "dit": {
                    "translation": "قال"
                },
                "divers": {
                    "translation": "متنوع"
                },
                "divertir": {
                    "translation": "يُنسّي"
                },
                "diviser": {
                    "translation": "يقسّم"
                },
                "dix": {
                    "translation": "عشرة"
                },
                "dix-huit": {
                    "translation": "ثمانية عشر"
                },
                "dix-neuf": {
                    "translation": "تسعة عشر"
                },
                "dix-sept": {
                    "translation": "سبعة عشر"
                },
                "docile": {
                    "translation": "مطيع"
                },
                "docilité": {
                    "translation": "انقياد"
                },
                "doigt": {
                    "translation": "إصبع"
                },
                "doit": {
                    "translation": "يجب"
                },
                "doivent": {
                    "translation": "يجبون"
                },
                "domaine": {
                    "translation": "مِلك"
                },
                "domestique": {
                    "translation": "منزلي"
                },
                "domicile": {
                    "translation": "مسكن"
                },
                "dominant": {
                    "translation": "مهيمن"
                },
                "domination": {
                    "translation": "هيمنة"
                },
                "dominer": {
                    "translation": "يهيمن"
                },
                "dommage": {
                    "translation": "ضرر"
                },
                "donation": {
                    "translation": "هبة"
                },
                "donc": {
                    "translation": "لذا"
                },
                "donne": {
                    "translation": "يعطي"
                },
                "donnent": {
                    "translation": "يعطون"
                },
                "donner": {
                    "translation": "يعطي"
                },
                "dormir": {
                    "translation": "ينام"
                },
                "doré": {
                    "translation": "ذهبي"
                },
                "dos": {
                    "translation": "ظهر"
                },
                "dossier": {
                    "translation": "ملف"
                },
                "dotation": {
                    "translation": "عهدة"
                },
                "double": {
                    "translation": "مضاعف"
                },
                "douleur": {
                    "translation": "ألم"
                },
                "doute": {
                    "translation": "ريبة"
                },
                "douter": {
                    "translation": "يشك"
                },
                "doux": {
                    "translation": "لين"
                },
                "douzaine": {
                    "translation": "دستة"
                },
                "douze": {
                    "translation": "اثنا عشر"
                },
                "dragon": {
                    "translation": "تنّين"
                },
                "dragée": {
                    "translation": "حبّة سكر"
                },
                "dramatique": {
                    "translation": "درامي"
                },
                "drap": {
                    "translation": "شرشف"
                },
                "drapeau": {
                    "translation": "علم"
                },
                "drapé": {
                    "translation": "ستائر"
                },
                "dressage": {
                    "translation": "تدريب"
                },
                "droguerie": {
                    "translation": "بقالة"
                },
                "droit": {
                    "translation": "حق"
                },
                "du": {
                    "translation": "من الـ"
                },
                "dune": {
                    "translation": "كثيب"
                },
                "duplicata": {
                    "translation": "نسخة"
                },
                "durable": {
                    "translation": "دائم"
                },
                "durer": {
                    "translation": "يدوم"
                },
                "dureté": {
                    "translation": "صلابة"
                },
                "durée": {
                    "translation": "مدة"
                },
                "dynastie": {
                    "translation": "سلالة"
                },
                "dé": {
                    "translation": "نرد"
                },
                "débarquer": {
                    "translation": "ينزل"
                },
                "débattre": {
                    "translation": "يناقش"
                },
                "début": {
                    "translation": "بداية"
                },
                "débutant": {
                    "translation": "مبتدئ"
                },
                "débutants": {
                    "translation": "مبتدئون"
                },
                "décembre": {
                    "translation": "ديسمبر"
                },
                "décence": {
                    "translation": "لياقة"
                },
                "décider": {
                    "translation": "يقرر"
                },
                "déclarer": {
                    "translation": "يعلن"
                },
                "décor": {
                    "translation": "ديكور"
                },
                "décourager": {
                    "translation": "يثبط"
                },
                "découvrir": {
                    "translation": "يكشف"
                },
                "décret": {
                    "translation": "مرسوم"
                },
                "décrire": {
                    "translation": "يصف"
                },
                "déduction": {
                    "translation": "استنباط"
                },
                "défaire": {
                    "translation": "يفك"
                },
                "défaut": {
                    "translation": "عيب"
                },
                "défendre": {
                    "translation": "يدافع"
                },
                "défi": {
                    "translation": "تحدٍّ"
                },
                "défier": {
                    "translation": "يتحدى"
                },
                "défilé": {
                    "translation": "موكب"
                },
                "définition": {
                    "translation": "تعريف"
                },
                "dégager": {
                    "translation": "يحرر"
                },
                "dégradation": {
                    "translation": "تدهور"
                },
                "déjeuner": {
                    "translation": "يتغداء"
                },
                "déjà": {
                    "translation": "بالفعل"
                },
                "délai": {
                    "translation": "مهلة"
                },
                "délicat": {
                    "translation": "رقيق"
                },
                "délice": {
                    "translation": "لذّة"
                },
                "démarche": {
                    "translation": "خطوة"
                },
                "démolition": {
                    "translation": "هدم"
                },
                "démonstration": {
                    "translation": "برهان"
                },
                "démontrer": {
                    "translation": "يبرهن"
                },
                "déménagement": {
                    "translation": "انتقال"
                },
                "déménager": {
                    "translation": "ينتقل"
                },
                "dénombrement": {
                    "translation": "عدّ"
                },
                "dénouement": {
                    "translation": "خاتمة"
                },
                "dépasser": {
                    "translation": "يتخطى"
                },
                "dépendance": {
                    "translation": "تبعية"
                },
                "dépendant": {
                    "translation": "معتمد"
                },
                "dépendre": {
                    "translation": "يعتمد"
                },
                "dépenser": {
                    "translation": "ينفق"
                },
                "déplacer": {
                    "translation": "ينقل"
                },
                "déposer": {
                    "translation": "يودع"
                },
                "déprimer": {
                    "translation": "يكتئب"
                },
                "dépêche": {
                    "translation": "إرسالية"
                },
                "dépôt": {
                    "translation": "مخزن"
                },
                "déranger": {
                    "translation": "يزعج"
                },
                "dérive": {
                    "translation": "انحراف"
                },
                "désert": {
                    "translation": "صحراء"
                },
                "désespoir": {
                    "translation": "يأس"
                },
                "désigner": {
                    "translation": "يشير"
                },
                "désireux": {
                    "translation": "شغوف"
                },
                "désobéir": {
                    "translation": "يعصي"
                },
                "désolant": {
                    "translation": "محزن"
                },
                "désoler": {
                    "translation": "يأسف"
                },
                "désolé": {
                    "translation": "آسف"
                },
                "détail": {
                    "translation": "تفصيل"
                },
                "détective": {
                    "translation": "محقّق"
                },
                "détermination": {
                    "translation": "عزيمة"
                },
                "déterminer": {
                    "translation": "يحدد"
                },
                "déterminé": {
                    "translation": "حازم"
                },
                "détester": {
                    "translation": "يكره"
                },
                "détresse": {
                    "translation": "ضيق"
                },
                "détruire": {
                    "translation": "يدمّر"
                },
                "développement": {
                    "translation": "تطور"
                },
                "développer": {
                    "translation": "يطور"
                },
                "déverser": {
                    "translation": "يسكب"
                },
                "dévouement": {
                    "translation": "تفانٍ"
                },
                "d’améliorer": {
                    "translation": "لتحسين"
                },
                "d’apprentissage": {
                    "translation": "التعلم"
                },
                "d’avoir": {
                    "translation": "لأنك امتلكت / لأنك فعلت"
                },
                "d’une": {
                    "translation": "لواحدة / لأحدى"
                },
                "eau": {
                    "translation": "ماء"
                },
                "echantillon": {
                    "translation": "عيّنة"
                },
                "effacer": {
                    "translation": "يمحو"
                },
                "effectuer": {
                    "translation": "ينفّذ"
                },
                "effet": {
                    "translation": "أثر"
                },
                "efficace": {
                    "translation": "فعال"
                },
                "effort": {
                    "translation": "مجهود"
                },
                "effrayer": {
                    "translation": "يفزع"
                },
                "elle": {
                    "translation": "هي"
                },
                "elles": {
                    "translation": "هنّ"
                },
                "emballage": {
                    "translation": "تغليف"
                },
                "emballer": {
                    "translation": "يغلّف"
                },
                "embauche": {
                    "translation": "توظيف"
                },
                "embouteillage": {
                    "translation": "ازدحام"
                },
                "embrasser": {
                    "translation": "يعانق"
                },
                "empathie": {
                    "translation": "تعاطف"
                },
                "emphase": {
                    "translation": "تشديد"
                },
                "empiler": {
                    "translation": "يرصّ"
                },
                "emploi": {
                    "translation": "وظيفة"
                },
                "emporter": {
                    "translation": "يأخذ معه"
                },
                "emprisonnement": {
                    "translation": "حبس"
                },
                "emprunter": {
                    "translation": "يستعير"
                },
                "en": {
                    "translation": "في / من"
                },
                "encens": {
                    "translation": "بخور"
                },
                "encore": {
                    "translation": "مرة أخرى"
                },
                "encourager": {
                    "translation": "يشجع"
                },
                "encre": {
                    "translation": "حبر"
                },
                "endroit": {
                    "translation": "مكان"
                },
                "enfance": {
                    "translation": "مرحلة الطفولة"
                },
                "enfant": {
                    "translation": "طفل"
                },
                "enfermer": {
                    "translation": "يحبس"
                },
                "engagement": {
                    "translation": "تزامن"
                },
                "engrenage": {
                    "translation": "ترس"
                },
                "enigme": {
                    "translation": "لغز"
                },
                "enivrement": {
                    "translation": "نشوة"
                },
                "enlever": {
                    "translation": "ينزع"
                },
                "ennemi": {
                    "translation": "عدو"
                },
                "ennui": {
                    "translation": "ضجر"
                },
                "ennuyer": {
                    "translation": "يضجر"
                },
                "enquête": {
                    "translation": "تحقيق"
                },
                "enregistrement": {
                    "translation": "تسجيل"
                },
                "enseigne": {
                    "translation": "لافتة"
                },
                "enseigner": {
                    "translation": "يدرّس"
                },
                "ensemble": {
                    "translation": "معًا"
                },
                "ensuite": {
                    "translation": "ثم"
                },
                "enterrer": {
                    "translation": "يدفن"
                },
                "entier": {
                    "translation": "كامل"
                },
                "entourer": {
                    "translation": "يحيط"
                },
                "entouré": {
                    "translation": "محيط"
                },
                "entraîner": {
                    "translation": "يدرّب"
                },
                "entraîneur": {
                    "translation": "مدرب"
                },
                "entre": {
                    "translation": "بين"
                },
                "entreprise": {
                    "translation": "شركة"
                },
                "entrepôt": {
                    "translation": "مستودع"
                },
                "entrer": {
                    "translation": "يدخل"
                },
                "entretien": {
                    "translation": "صيانة"
                },
                "enveloppe": {
                    "translation": "ظرف"
                },
                "envie": {
                    "translation": "رغبة"
                },
                "envier": {
                    "translation": "يحسد"
                },
                "envoi": {
                    "translation": "إرسال"
                },
                "envoyer": {
                    "translation": "يرسل"
                },
                "errant": {
                    "translation": "تائه"
                },
                "escabeau": {
                    "translation": "مقعد صغير"
                },
                "escalier": {
                    "translation": "درج"
                },
                "escorte": {
                    "translation": "مرافقة"
                },
                "espace": {
                    "translation": "مساحة"
                },
                "espionner": {
                    "translation": "يتجسّس"
                },
                "espoir": {
                    "translation": "أمل"
                },
                "esprit": {
                    "translation": "عقل"
                },
                "espérons": {
                    "translation": "نأمل"
                },
                "essai": {
                    "translation": "محاولة"
                },
                "essayer": {
                    "translation": "يحاول"
                },
                "essayez": {
                    "translation": "حاول"
                },
                "essence": {
                    "translation": "بنزين"
                },
                "essuie-glace": {
                    "translation": "مساحة زجاج"
                },
                "essuyer": {
                    "translation": "يمسح"
                },
                "est": {
                    "translation": "يكون (هو)"
                },
                "estime": {
                    "translation": "تقدير"
                },
                "et": {
                    "translation": "و"
                },
                "exact": {
                    "translation": "دقيق"
                },
                "examen": {
                    "translation": "امتحان"
                },
                "examiner": {
                    "translation": "يفحص"
                },
                "excellence": {
                    "translation": "امتياز"
                },
                "excellent": {
                    "translation": "ممتاز"
                },
                "exception": {
                    "translation": "استثناء"
                },
                "exceptionnel": {
                    "translation": "استثنائي"
                },
                "excitation": {
                    "translation": "إثارة"
                },
                "exclusif": {
                    "translation": "حصري"
                },
                "excuser": {
                    "translation": "يعتذر"
                },
                "exemplar": {
                    "translation": "مثالي"
                },
                "exemple": {
                    "translation": "مثال"
                },
                "exiger": {
                    "translation": "يستدعي"
                },
                "exil": {
                    "translation": "منفى"
                },
                "existence": {
                    "translation": "وجود"
                },
                "exotique": {
                    "translation": "غريب"
                },
                "expliquer": {
                    "translation": "يشرح"
                },
                "explorer": {
                    "translation": "يستكشف"
                },
                "explosion": {
                    "translation": "انفجار"
                },
                "exposer": {
                    "translation": "يعرض"
                },
                "exposition": {
                    "translation": "معرض"
                },
                "expérience": {
                    "translation": "تجربة"
                },
                "extase": {
                    "translation": "نشوة"
                },
                "extension": {
                    "translation": "توسعة"
                },
                "extraordinaire": {
                    "translation": "خارق"
                },
                "extrémit": {
                    "translation": "طرفة"
                },
                "exécution": {
                    "translation": "إعدام"
                },
                "eénoncer": {
                    "translation": "يصرّح"
                },
                "facile": {
                    "translation": "سهل"
                },
                "facture": {
                    "translation": "فاتورة"
                },
                "faculty": {
                    "translation": "كلية"
                },
                "faible": {
                    "translation": "ضعيف"
                },
                "faire": {
                    "translation": "يفعل"
                },
                "faisan": {
                    "translation": "تدرج"
                },
                "fait": {
                    "translation": "فعل / صنع"
                },
                "falaise": {
                    "translation": "جرف"
                },
                "falloir": {
                    "translation": "يلزم"
                },
                "famille": {
                    "translation": "عائلة"
                },
                "farine": {
                    "translation": "طحين"
                },
                "fascinant": {
                    "translation": "آسر"
                },
                "fatigue": {
                    "translation": "تعب"
                },
                "fatigué": {
                    "translation": "متعب"
                },
                "faute": {
                    "translation": "خطأ"
                },
                "fauteuil": {
                    "translation": "كرسي بذراعين"
                },
                "façon": {
                    "translation": "طريقة"
                },
                "femme": {
                    "translation": "امرأة / زوجة"
                },
                "fenêtre": {
                    "translation": "نافذة"
                },
                "fer": {
                    "translation": "مكواة"
                },
                "fermer": {
                    "translation": "يغلق"
                },
                "fermier": {
                    "translation": "مزارع"
                },
                "fermé": {
                    "translation": "مغلق"
                },
                "feu": {
                    "translation": "نار"
                },
                "feuille": {
                    "translation": "ورقة"
                },
                "fidèle": {
                    "translation": "وفي"
                },
                "fierté": {
                    "translation": "فخر"
                },
                "figure": {
                    "translation": "وجه"
                },
                "fille": {
                    "translation": "ابنة / فتاة"
                },
                "fils": {
                    "translation": "ابن"
                },
                "fin": {
                    "translation": "نهاية"
                },
                "finir": {
                    "translation": "يستمر / ينتهي"
                },
                "fièvre": {
                    "translation": "حمى"
                },
                "fleur": {
                    "translation": "زهرة"
                },
                "fleuve": {
                    "translation": "نهر"
                },
                "fois": {
                    "translation": "مرة"
                },
                "fonctionnalité": {
                    "translation": "ميزة"
                },
                "fondre": {
                    "translation": "يذوب"
                },
                "forme": {
                    "translation": "شكل"
                },
                "formuler": {
                    "translation": "يصاغ"
                },
                "fort": {
                    "translation": "قوي"
                },
                "forêt": {
                    "translation": "غابة"
                },
                "foule": {
                    "translation": "حشد"
                },
                "four": {
                    "translation": "فرن"
                },
                "fourchette": {
                    "translation": "شوكة"
                },
                "fourmi": {
                    "translation": "نملة"
                },
                "fourniture": {
                    "translation": "إمداد"
                },
                "fragile": {
                    "translation": "هش"
                },
                "fraises": {
                    "translation": "فراولة"
                },
                "franc": {
                    "translation": "صريح"
                },
                "fraternité": {
                    "translation": "أخاء"
                },
                "frein": {
                    "translation": "مكابح"
                },
                "frissonner": {
                    "translation": "يقشعر"
                },
                "froidure": {
                    "translation": "برد"
                },
                "fromage": {
                    "translation": "جبن"
                },
                "frontière": {
                    "translation": "حدود"
                },
                "frotter": {
                    "translation": "يفرك"
                },
                "fruit": {
                    "translation": "فاكهة"
                },
                "frère": {
                    "translation": "أخ"
                },
                "fréquent": {
                    "translation": "متكرر"
                },
                "fuir": {
                    "translation": "يهرب"
                },
                "futur": {
                    "translation": "مستقبلي"
                },
                "fâché": {
                    "translation": "غاضب"
                },
                "fée": {
                    "translation": "جنّية"
                },
                "féliciter": {
                    "translation": "يهنئ"
                },
                "février": {
                    "translation": "فبراير"
                },
                "gagner": {
                    "translation": "يفوز"
                },
                "galaxie": {
                    "translation": "مجرة"
                },
                "gant": {
                    "translation": "قفاز"
                },
                "garder": {
                    "translation": "يحتفظ"
                },
                "gare": {
                    "translation": "محطة قطار"
                },
                "gazon": {
                    "translation": "مرج أخضر"
                },
                "genou": {
                    "translation": "ركبة"
                },
                "genres": {
                    "translation": "أنواع"
                },
                "gens": {
                    "translation": "ناس"
                },
                "gentil": {
                    "translation": "لطيف"
                },
                "geste": {
                    "translation": "إيماءة"
                },
                "gigantesque": {
                    "translation": "عملاق"
                },
                "girafe": {
                    "translation": "زرافة"
                },
                "givre": {
                    "translation": "صقيع"
                },
                "glace": {
                    "translation": "مثلجات"
                },
                "glacial": {
                    "translation": "متجمد"
                },
                "glisser": {
                    "translation": "ينزلق"
                },
                "glossaire": {
                    "translation": "مسرد"
                },
                "gomme": {
                    "translation": "ممحاة"
                },
                "goutte": {
                    "translation": "قطرة"
                },
                "goût": {
                    "translation": "طعم"
                },
                "goûter": {
                    "translation": "يتذوق"
                },
                "gracieux": {
                    "translation": "رشيق"
                },
                "graine": {
                    "translation": "بذرة"
                },
                "grammaticales": {
                    "translation": "نحوية"
                },
                "gramme": {
                    "translation": "غرام"
                },
                "grand-mère": {
                    "translation": "جدة"
                },
                "grand-père": {
                    "translation": "جد"
                },
                "gras": {
                    "translation": "دهني"
                },
                "grenier": {
                    "translation": "علّية"
                },
                "grenouille": {
                    "translation": "ضفدع"
                },
                "grimper": {
                    "translation": "يتسلّق"
                },
                "grippe": {
                    "translation": "إنفلونزا"
                },
                "gris": {
                    "translation": "رمادي"
                },
                "gros": {
                    "translation": "سمين"
                },
                "grotte": {
                    "translation": "كهف صغير"
                },
                "groupe": {
                    "translation": "مجموعة"
                },
                "grâce": {
                    "translation": "بفضل"
                },
                "grêle": {
                    "translation": "بَرَد"
                },
                "guerre": {
                    "translation": "حرب"
                },
                "guérir": {
                    "translation": "يشفي"
                },
                "guérison": {
                    "translation": "شفاء"
                },
                "gâteau": {
                    "translation": "كعكة"
                },
                "général": {
                    "translation": "عام"
                },
                "généreux": {
                    "translation": "كريم"
                },
                "géographie": {
                    "translation": "جغرافيا"
                },
                "gérer": {
                    "translation": "يدير"
                },
                "habiter": {
                    "translation": "يسكن"
                },
                "habituel": {
                    "translation": "معتاد"
                },
                "haine": {
                    "translation": "كره"
                },
                "hardi": {
                    "translation": "جريء"
                },
                "harmonieux": {
                    "translation": "متناغم"
                },
                "haut": {
                    "translation": "قمة"
                },
                "hauteur": {
                    "translation": "ارتفاع"
                },
                "haïr": {
                    "translation": "يكره"
                },
                "herbe": {
                    "translation": "عشب"
                },
                "hermine": {
                    "translation": "ابن عرس"
                },
                "heure": {
                    "translation": "ساعة"
                },
                "heureux": {
                    "translation": "سعيد"
                },
                "hibou": {
                    "translation": "بومة"
                },
                "hier": {
                    "translation": "أمس"
                },
                "histoire": {
                    "translation": "تاريخ / قصة"
                },
                "histoires": {
                    "translation": "قصص"
                },
                "hiver": {
                    "translation": "شتاء"
                },
                "honnête": {
                    "translation": "صادق"
                },
                "honte": {
                    "translation": "خجل"
                },
                "horaire": {
                    "translation": "جدول زمني"
                },
                "horloge": {
                    "translation": "ساعة حائط"
                },
                "hostile": {
                    "translation": "عدائي"
                },
                "huile": {
                    "translation": "زيت"
                },
                "huit": {
                    "translation": "ثمانية"
                },
                "humain": {
                    "translation": "بشري"
                },
                "humble": {
                    "translation": "متواضع"
                },
                "humidité": {
                    "translation": "رطوبة"
                },
                "hymne": {
                    "translation": "نشيد"
                },
                "hypothèque": {
                    "translation": "رهن"
                },
                "hypothèسة": {
                    "translation": "فرضية"
                },
                "hélicoptère": {
                    "translation": "مروحية"
                },
                "héroïque": {
                    "translation": "بطولي"
                },
                "hôpital": {
                    "translation": "مستشفى"
                },
                "hôtel": {
                    "translation": "فندق"
                },
                "ici": {
                    "translation": "هنا"
                },
                "idée": {
                    "translation": "فكرة"
                },
                "ignoble": {
                    "translation": "خسيس"
                },
                "il": {
                    "translation": "هو"
                },
                "ils": {
                    "translation": "هم"
                },
                "image": {
                    "translation": "صورة"
                },
                "immense": {
                    "translation": "هائل"
                },
                "immeuble": {
                    "translation": "عمارة"
                },
                "impatient": {
                    "translation": "غير صبور"
                },
                "implorer": {
                    "translation": "يستجدي"
                },
                "importance": {
                    "translation": "أهمية"
                },
                "impressionner": {
                    "translation": "يُبهر"
                },
                "impôt": {
                    "translation": "ضريبة"
                },
                "inconvénient": {
                    "translation": "عيب"
                },
                "indice": {
                    "translation": "لمحة"
                },
                "indiquer": {
                    "translation": "يشير"
                },
                "infirmier": {
                    "translation": "ممرضة"
                },
                "infirmière": {
                    "translation": "ممرضة"
                },
                "ingénieur": {
                    "translation": "مهندس"
                },
                "injustice": {
                    "translation": "ظلم"
                },
                "inondation": {
                    "translation": "طوفان"
                },
                "inquiétez": {
                    "translation": "تقلق"
                },
                "insecte": {
                    "translation": "حشرة"
                },
                "intelligence": {
                    "translation": "ذكاء"
                },
                "intense": {
                    "translation": "شديد"
                },
                "interactive": {
                    "translation": "تفاعلية"
                },
                "interdire": {
                    "translation": "يمنع"
                },
                "intermédiaire": {
                    "translation": "متوسط"
                },
                "intimider": {
                    "translation": "يرهب"
                },
                "introduire": {
                    "translation": "يُدخل"
                },
                "intéressants": {
                    "translation": "ممتعة"
                },
                "inventer": {
                    "translation": "يخترع"
                },
                "invention": {
                    "translation": "اختراع"
                },
                "invincible": {
                    "translation": "لا يقهر"
                },
                "inviter": {
                    "translation": "يدعو"
                },
                "istories": {
                    "translation": "قصص"
                },
                "jalousie": {
                    "translation": "غيرة"
                },
                "jamais": {
                    "translation": "أبدًا"
                },
                "jambe": {
                    "translation": "ساق"
                },
                "janvier": {
                    "translation": "يناير"
                },
                "jardin": {
                    "translation": "حديقة"
                },
                "jardinier": {
                    "translation": "بستاني"
                },
                "jaune": {
                    "translation": "أصفر"
                },
                "je": {
                    "translation": "أنا"
                },
                "jeter": {
                    "translation": "يرمي"
                },
                "jeu": {
                    "translation": "لعبة"
                },
                "jeudi": {
                    "translation": "الخميس"
                },
                "joie": {
                    "translation": "فرح"
                },
                "jouer": {
                    "translation": "يلعب"
                },
                "jouet": {
                    "translation": "لعبة أطفال"
                },
                "joueur": {
                    "translation": "لاعب"
                },
                "jour": {
                    "translation": "يوم"
                },
                "journal": {
                    "translation": "جريدة"
                },
                "journee": {
                    "translation": "يومية"
                },
                "joyeux": {
                    "translation": "مرح"
                },
                "juge": {
                    "translation": "قاضٍ"
                },
                "juillet": {
                    "translation": "يوليو"
                },
                "juin": {
                    "translation": "يونيو"
                },
                "jungle": {
                    "translation": "أدغال"
                },
                "jupe": {
                    "translation": "تنورة"
                },
                "jurer": {
                    "translation": "يقسم"
                },
                "jus": {
                    "translation": "عصير"
                },
                "jusqu": {
                    "translation": "حتى"
                },
                "kilogramme": {
                    "translation": "كيلوجرام"
                },
                "kilomètre": {
                    "translation": "كيلومتر"
                },
                "la": {
                    "translation": "الـ (مؤنث)"
                },
                "lac": {
                    "translation": "بحيرة"
                },
                "laid": {
                    "translation": "قبيح"
                },
                "laisser": {
                    "translation": "يترك"
                },
                "lait": {
                    "translation": "حليب"
                },
                "lame": {
                    "translation": "شفرة"
                },
                "lampe": {
                    "translation": "مصباح"
                },
                "langue": {
                    "translation": "لسان / لغة"
                },
                "langues": {
                    "translation": "لغات"
                },
                "lapin": {
                    "translation": "أرنب"
                },
                "largeur": {
                    "translation": "عرض"
                },
                "larme": {
                    "translation": "دمعة"
                },
                "lave-linge": {
                    "translation": "غسالة"
                },
                "laver": {
                    "translation": "يغسل"
                },
                "le": {
                    "translation": "الـ (مذكر)"
                },
                "lent": {
                    "translation": "بطيء"
                },
                "lentement": {
                    "translation": "ببطء"
                },
                "les": {
                    "translation": "الـ (جمع)"
                },
                "lettre": {
                    "translation": "رسالة"
                },
                "leur": {
                    "translation": "خاصهم"
                },
                "leurs": {
                    "translation": "خاصهم (جمع)"
                },
                "lever": {
                    "translation": "يرفع"
                },
                "leçon": {
                    "translation": "درس"
                },
                "liberté": {
                    "translation": "حرية"
                },
                "libre": {
                    "translation": "حر"
                },
                "libéral": {
                    "translation": "حر"
                },
                "libérer": {
                    "translation": "يحرر"
                },
                "licenciement": {
                    "translation": "فصل"
                },
                "ligne": {
                    "translation": "سطر"
                },
                "limite": {
                    "translation": "حد"
                },
                "linguistique": {
                    "translation": "لغوي"
                },
                "linguistiques": {
                    "translation": "لغوية"
                },
                "lion": {
                    "translation": "أسد"
                },
                "lire": {
                    "translation": "يقرأ"
                },
                "lisant": {
                    "translation": "قارئ"
                },
                "liste": {
                    "translation": "قائمة"
                },
                "listes": {
                    "translation": "قوائم"
                },
                "lit": {
                    "translation": "سرير"
                },
                "litre": {
                    "translation": "لتر"
                },
                "littérature": {
                    "translation": "أدب"
                },
                "livre": {
                    "translation": "كتاب"
                },
                "local": {
                    "translation": "محلي"
                },
                "locataire": {
                    "translation": "مستأجر"
                },
                "logique": {
                    "translation": "منطقي"
                },
                "loi": {
                    "translation": "قانون"
                },
                "longueur": {
                    "translation": "طول"
                },
                "losange": {
                    "translation": "معين"
                },
                "louer": {
                    "translation": "يمدح"
                },
                "loup-garou": {
                    "translation": "عواء"
                },
                "lourd": {
                    "translation": "ثقيل"
                },
                "loyal": {
                    "translation": "وفي"
                },
                "loyer": {
                    "translation": "إيجار"
                },
                "lucide": {
                    "translation": "واعٍ"
                },
                "lumineux": {
                    "translation": "مشرق"
                },
                "lumière": {
                    "translation": "ضوء"
                },
                "lundi": {
                    "translation": "الاثنين"
                },
                "lune": {
                    "translation": "قمر"
                },
                "lunettes": {
                    "translation": "نظارة"
                },
                "luxueux": {
                    "translation": "فاخر"
                },
                "là": {
                    "translation": "هناك"
                },
                "lâche": {
                    "translation": "جبان"
                },
                "légende": {
                    "translation": "أسطورة"
                },
                "légume": {
                    "translation": "خضار"
                },
                "lézard": {
                    "translation": "ورل"
                },
                "l’apprentissage": {
                    "translation": "التعلم"
                },
                "l’un": {
                    "translation": "الواحد"
                },
                "ma": {
                    "translation": "خاصتي (مؤنث)"
                },
                "magasin": {
                    "translation": "متجر"
                },
                "magnifique": {
                    "translation": "رائع"
                },
                "maigre": {
                    "translation": "نحيف"
                },
                "main": {
                    "translation": "يد"
                },
                "maintenant": {
                    "translation": "الآن"
                },
                "mais": {
                    "translation": "لكن"
                },
                "maison": {
                    "translation": "منزل"
                },
                "mal": {
                    "translation": "بلا / سيئ"
                },
                "malade": {
                    "translation": "مريض"
                },
                "maladie": {
                    "translation": "مرض"
                },
                "malgré": {
                    "translation": "رغم"
                },
                "malheur": {
                    "translation": "شقاة"
                },
                "manche": {
                    "translation": "مقبض"
                },
                "mangue": {
                    "translation": "مانجو"
                },
                "manière": {
                    "translation": "أسلوب"
                },
                "manteau": {
                    "translation": "معطف"
                },
                "marchand": {
                    "translation": "تاجر"
                },
                "marcher": {
                    "translation": "يمشي"
                },
                "marché": {
                    "translation": "سوق"
                },
                "mardi": {
                    "translation": "الثلاثاء"
                },
                "mari": {
                    "translation": "زوج"
                },
                "marron": {
                    "translation": "بني"
                },
                "mars": {
                    "translation": "مارس"
                },
                "marteau": {
                    "translation": "مطرقة"
                },
                "marée": {
                    "translation": "مد وجزر"
                },
                "mathématiques": {
                    "translation": "رياضيات"
                },
                "matin": {
                    "translation": "صباح"
                },
                "maïs": {
                    "translation": "ذرة"
                },
                "me": {
                    "translation": "إياي"
                },
                "meilleurs": {
                    "translation": "أفضل"
                },
                "melon": {
                    "translation": "شمام"
                },
                "menacer": {
                    "translation": "يهدّد"
                },
                "mensonge": {
                    "translation": "كذبة"
                },
                "mer": {
                    "translation": "بحر"
                },
                "merci": {
                    "translation": "شكرا"
                },
                "mercredi": {
                    "translation": "الأربعاء"
                },
                "mes": {
                    "translation": "خاصتي (جمع)"
                },
                "message": {
                    "translation": "رسالة"
                },
                "mesurer": {
                    "translation": "يقيس"
                },
                "met": {
                    "translation": "يضع"
                },
                "mettent": {
                    "translation": "يضعون"
                },
                "mettre": {
                    "translation": "يضع"
                },
                "meuble": {
                    "translation": "أثاث"
                },
                "midi": {
                    "translation": "الظهيرة"
                },
                "milieu": {
                    "translation": "وسط"
                },
                "mille": {
                    "translation": "ألف"
                },
                "milliard": {
                    "translation": "مليار"
                },
                "millier": {
                    "translation": "آلاف"
                },
                "minuit": {
                    "translation": "منتصف الليل"
                },
                "minute": {
                    "translation": "دقيقة"
                },
                "miroir": {
                    "translation": "مرآة"
                },
                "miséricorde": {
                    "translation": "رحمة"
                },
                "mocassin": {
                    "translation": "حذاء رخيص"
                },
                "modèle": {
                    "translation": "نموذج"
                },
                "moins": {
                    "translation": "أقل"
                },
                "mois": {
                    "translation": "شهر"
                },
                "moitié": {
                    "translation": "نصف"
                },
                "moment": {
                    "translation": "لحظة"
                },
                "mon": {
                    "translation": "خاصتي"
                },
                "monastère": {
                    "translation": "دير"
                },
                "monde": {
                    "translation": "عالم"
                },
                "montagne": {
                    "translation": "جبل"
                },
                "monter": {
                    "translation": "يصعد"
                },
                "montre": {
                    "translation": "ساعة يد"
                },
                "montrer": {
                    "translation": "يُظهر"
                },
                "monument": {
                    "translation": "نصب"
                },
                "mosaïque": {
                    "translation": "فسيفساء"
                },
                "mosquée": {
                    "translation": "مسجد"
                },
                "mot": {
                    "translation": "كلمة"
                },
                "moteur": {
                    "translation": "محرك"
                },
                "moto": {
                    "translation": "دراجة نارية"
                },
                "mots": {
                    "translation": "كلمات"
                },
                "mouche": {
                    "translation": "ذبابة"
                },
                "mourir": {
                    "translation": "يموت"
                },
                "mousse": {
                    "translation": "طحلب"
                },
                "moustique": {
                    "translation": "بعوضة"
                },
                "mouvement": {
                    "translation": "حركة"
                },
                "moyenne": {
                    "translation": "متوسط"
                },
                "moyens": {
                    "translation": "طرق"
                },
                "mur": {
                    "translation": "جدار"
                },
                "muraille": {
                    "translation": "سور"
                },
                "musicien": {
                    "translation": "موسيقي"
                },
                "musique": {
                    "translation": "موسيقى"
                },
                "musée": {
                    "translation": "متحف"
                },
                "mère": {
                    "translation": "أم"
                },
                "mètre": {
                    "translation": "متر"
                },
                "médecin": {
                    "translation": "طبيب"
                },
                "médecine": {
                    "translation": "دواء"
                },
                "médicament": {
                    "translation": "علاج دوائي"
                },
                "mélanger": {
                    "translation": "يخلط"
                },
                "mémoire": {
                    "translation": "ذاكرة"
                },
                "mémoriser": {
                    "translation": "يحفظ"
                },
                "mérite": {
                    "translation": "جدارة"
                },
                "mériter": {
                    "translation": "يستحق"
                },
                "métal": {
                    "translation": "معدن"
                },
                "méthode": {
                    "translation": "طريقة"
                },
                "métier": {
                    "translation": "حرفة"
                },
                "météo": {
                    "translation": "طقس"
                },
                "même": {
                    "translation": "نفس"
                },
                "nager": {
                    "translation": "يسبح"
                },
                "nappage": {
                    "translation": "فرش"
                },
                "nappe": {
                    "translation": "مفرش طاولة"
                },
                "narrer": {
                    "translation": "يسرد"
                },
                "nature": {
                    "translation": "طبيعة"
                },
                "naturellement": {
                    "translation": "بطبيعة"
                },
                "navette": {
                    "translation": "مركبة فضاء"
                },
                "naître": {
                    "translation": "يولد"
                },
                "ne": {
                    "translation": "لا (نفي)"
                },
                "neige": {
                    "translation": "ثلج"
                },
                "nettoyer": {
                    "translation": "ينظف"
                },
                "neuf": {
                    "translation": "تسعة"
                },
                "nez": {
                    "translation": "أنف"
                },
                "ni": {
                    "translation": "ولا"
                },
                "nier": {
                    "translation": "يكنّي"
                },
                "niveaux": {
                    "translation": "المستويات"
                },
                "niveller": {
                    "translation": "يسوي"
                },
                "noble": {
                    "translation": "نبيل"
                },
                "noir": {
                    "translation": "أسود"
                },
                "noix": {
                    "translation": "جوز"
                },
                "nombre": {
                    "translation": "رقم"
                },
                "nombreux": {
                    "translation": "عديد"
                },
                "nommer": {
                    "translation": "يسمّي"
                },
                "non": {
                    "translation": "لا"
                },
                "nos": {
                    "translation": "خاصتنا (جمع)"
                },
                "note": {
                    "translation": "ملاحظة / نقطة"
                },
                "notoire": {
                    "translation": "مشهور"
                },
                "notre": {
                    "translation": "خاصتنا"
                },
                "nous": {
                    "translation": "نحن"
                },
                "nouvelle": {
                    "translation": "خبر"
                },
                "novembre": {
                    "translation": "نوفمبر"
                },
                "nuage": {
                    "translation": "سحابة"
                },
                "nuisible": {
                    "translation": "ضار"
                },
                "nuit": {
                    "translation": "ليل"
                },
                "n’importe": {
                    "translation": "أي"
                },
                "n’oubliez": {
                    "translation": "لا تنسوا"
                },
                "objectif": {
                    "translation": "غاية"
                },
                "objectifs": {
                    "translation": "أهداف"
                },
                "objet": {
                    "translation": "غرض"
                },
                "obscur": {
                    "translation": "معتم"
                },
                "obstiné": {
                    "translation": "عنيد"
                },
                "occupé": {
                    "translation": "مشغول"
                },
                "octobre": {
                    "translation": "أكتوبر"
                },
                "odeur": {
                    "translation": "رائحة"
                },
                "officiel": {
                    "translation": "رسمي"
                },
                "ogre": {
                    "translation": "غول"
                },
                "oignon": {
                    "translation": "بصل"
                },
                "oiseau": {
                    "translation": "طائر"
                },
                "ombre": {
                    "translation": "ظل"
                },
                "oncle": {
                    "translation": "عم"
                },
                "ont": {
                    "translation": "يملكون"
                },
                "onze": {
                    "translation": "أحد عشر"
                },
                "opportun": {
                    "translation": "مناسب"
                },
                "orage": {
                    "translation": "عاصفة"
                },
                "orange": {
                    "translation": "برتقالي"
                },
                "ordinaire": {
                    "translation": "عادي"
                },
                "ordinateur": {
                    "translation": "حاسوب"
                },
                "ordonnance": {
                    "translation": "وصفة طبية"
                },
                "ordre": {
                    "translation": "أمر"
                },
                "oreille": {
                    "translation": "أذن"
                },
                "oreiller": {
                    "translation": "وسادة"
                },
                "organiser": {
                    "translation": "ينظّم"
                },
                "origine": {
                    "translation": "أصالة"
                },
                "os": {
                    "translation": "عظام"
                },
                "ou": {
                    "translation": "أو"
                },
                "oublier": {
                    "translation": "ينسى"
                },
                "oui": {
                    "translation": "نعم"
                },
                "ours": {
                    "translation": "دب"
                },
                "outil": {
                    "translation": "أداة"
                },
                "ouvert": {
                    "translation": "مفتوح"
                },
                "ouvrir": {
                    "translation": "يفتح"
                },
                "où": {
                    "translation": "أين"
                },
                "page": {
                    "translation": "صفحة"
                },
                "paie": {
                    "translation": "أجرة"
                },
                "pain": {
                    "translation": "خبز"
                },
                "paix": {
                    "translation": "سلام"
                },
                "palmier": {
                    "translation": "نخلة"
                },
                "panier": {
                    "translation": "سلة"
                },
                "pantalon": {
                    "translation": "بنطال"
                },
                "paon": {
                    "translation": "طاووس"
                },
                "papier": {
                    "translation": "ورق"
                },
                "papillon": {
                    "translation": "فراشة"
                },
                "par": {
                    "translation": "بواسطة"
                },
                "paragraphe": {
                    "translation": "فقرة"
                },
                "parapluie": {
                    "translation": "مظلة"
                },
                "paraître": {
                    "translation": "يظهر"
                },
                "parcours": {
                    "translation": "مسار"
                },
                "pardon": {
                    "translation": "عفوًا"
                },
                "pardonner": {
                    "translation": "يسامح"
                },
                "parents": {
                    "translation": "الوالدان"
                },
                "parfait": {
                    "translation": "مثالي"
                },
                "parfaites": {
                    "translation": "مثالية"
                },
                "parfois": {
                    "translation": "أحيانًا"
                },
                "parler": {
                    "translation": "يتكلم"
                },
                "part": {
                    "translation": "جزء"
                },
                "partager": {
                    "translation": "يشارك"
                },
                "partenaire": {
                    "translation": "شريك"
                },
                "partie": {
                    "translation": "جزء"
                },
                "partir": {
                    "translation": "يغادر"
                },
                "partout": {
                    "translation": "كل مكان"
                },
                "pas": {
                    "translation": "ليس"
                },
                "passeport": {
                    "translation": "جواز سفر"
                },
                "passer": {
                    "translation": "يمر"
                },
                "passionnantes": {
                    "translation": "مثيرة"
                },
                "pastèque": {
                    "translation": "بطيخ"
                },
                "patience": {
                    "translation": "صبر"
                },
                "patrie": {
                    "translation": "وطن"
                },
                "patron": {
                    "translation": "رئيس"
                },
                "pauvre": {
                    "translation": "فقير"
                },
                "pauvreté": {
                    "translation": "فقر"
                },
                "payer": {
                    "translation": "يدفع"
                },
                "pays": {
                    "translation": "بلد"
                },
                "paysage": {
                    "translation": "منظر طبيعي"
                },
                "peau": {
                    "translation": "جلد"
                },
                "peintre": {
                    "translation": "رسام"
                },
                "peinture": {
                    "translation": "رسم زيتي"
                },
                "pelle": {
                    "translation": "مجرفة"
                },
                "pendant": {
                    "translation": "أثناء"
                },
                "penser": {
                    "translation": "يفكر"
                },
                "pensée": {
                    "translation": "فكرة"
                },
                "pente": {
                    "translation": "منحدر"
                },
                "perceuse": {
                    "translation": "مثقاب"
                },
                "perdre": {
                    "translation": "يخسر"
                },
                "perdrix": {
                    "translation": "حجل"
                },
                "pertenir": {
                    "translation": "يعود"
                },
                "peur": {
                    "translation": "خوف"
                },
                "peureux": {
                    "translation": "خائف"
                },
                "peut": {
                    "translation": "يستطيع"
                },
                "peuvent": {
                    "translation": "يستطيعون"
                },
                "phare": {
                    "translation": "مصباح سيارة"
                },
                "pharmacie": {
                    "translation": "صيدلية"
                },
                "photo": {
                    "translation": "صورة"
                },
                "phrase": {
                    "translation": "جملة"
                },
                "phrases": {
                    "translation": "جمل"
                },
                "physique": {
                    "translation": "فيزياء"
                },
                "phénomène": {
                    "translation": "ظاهرة"
                },
                "pied": {
                    "translation": "قدم"
                },
                "pierre": {
                    "translation": "حجر"
                },
                "pilote": {
                    "translation": "طيّار"
                },
                "pioche": {
                    "translation": "فأس"
                },
                "pitiè": {
                    "translation": "رأفة"
                },
                "pittoresque": {
                    "translation": "بديع"
                },
                "pièce": {
                    "translation": "غرفة"
                },
                "place": {
                    "translation": "ساحة / مكان"
                },
                "plafond": {
                    "translation": "سقف"
                },
                "plage": {
                    "translation": "شاطئ"
                },
                "plairont": {
                    "translation": "تعجبكم"
                },
                "plaisir": {
                    "translation": "متعة"
                },
                "plante": {
                    "translation": "نبات"
                },
                "planète": {
                    "translation": "كوكب"
                },
                "plat": {
                    "translation": "طبق"
                },
                "plein": {
                    "translation": "ممتلئ"
                },
                "pleurer": {
                    "translation": "يبكي"
                },
                "pluie": {
                    "translation": "مطر"
                },
                "plus": {
                    "translation": "أكثر"
                },
                "plusieurs": {
                    "translation": "عدة"
                },
                "pneu": {
                    "translation": "إطار"
                },
                "poche": {
                    "translation": "جيب"
                },
                "poids": {
                    "translation": "وزن"
                },
                "point": {
                    "translation": "نقطة"
                },
                "pointe": {
                    "translation": "طرف"
                },
                "poisson": {
                    "translation": "سمك"
                },
                "poitrine": {
                    "translation": "صدر"
                },
                "poivre": {
                    "translation": "فلفل"
                },
                "policier": {
                    "translation": "شرطي"
                },
                "pomme": {
                    "translation": "تفاحة"
                },
                "pomme-de-terre": {
                    "translation": "بطاطا"
                },
                "pompier": {
                    "translation": "إطفائي"
                },
                "pont": {
                    "translation": "جسر"
                },
                "populaire": {
                    "translation": "شعبي"
                },
                "porte": {
                    "translation": "باب"
                },
                "portefeuille": {
                    "translation": "محفظة"
                },
                "portrait": {
                    "translation": "بورتريه"
                },
                "poser": {
                    "translation": "يضع"
                },
                "position": {
                    "translation": "موضع"
                },
                "posé": {
                    "translation": "هادئ"
                },
                "pot": {
                    "translation": "قدر"
                },
                "poulet": {
                    "translation": "دجاج"
                },
                "pour": {
                    "translation": "من أجل"
                },
                "pourquoi": {
                    "translation": "لماذا"
                },
                "pourtant": {
                    "translation": "ومع ذلك"
                },
                "pousser": {
                    "translation": "يدفع"
                },
                "pouvez": {
                    "translation": "يمكنك"
                },
                "pouvoir": {
                    "translation": "يستطيع"
                },
                "poésie": {
                    "translation": "شعر"
                },
                "poêle": {
                    "translation": "مقلاة"
                },
                "prairie": {
                    "translation": "مرج"
                },
                "pratique": {
                    "translation": "ممارسة"
                },
                "pratiquer": {
                    "translation": "يمارس"
                },
                "premier": {
                    "translation": "أول"
                },
                "prend": {
                    "translation": "يأخذ"
                },
                "prendre": {
                    "translation": "يأخذ"
                },
                "prennent": {
                    "translation": "يأخذون"
                },
                "preuve": {
                    "translation": "دليل"
                },
                "prime": {
                    "translation": "علاوة"
                },
                "primitif": {
                    "translation": "بدائي"
                },
                "prince": {
                    "translation": "أمير"
                },
                "princesse": {
                    "translation": "أميرة"
                },
                "principal": {
                    "translation": "رئيسي"
                },
                "principe": {
                    "translation": "مبدأ"
                },
                "printemps": {
                    "translation": "ربيع"
                },
                "prix": {
                    "translation": "سعر"
                },
                "problème": {
                    "translation": "مشكلة"
                },
                "processus": {
                    "translation": "عملية"
                },
                "procédure": {
                    "translation": "إجراء"
                },
                "professeur": {
                    "translation": "معلم"
                },
                "profitant": {
                    "translation": "مستفيدًا / مستمتعًا"
                },
                "profond": {
                    "translation": "عميق"
                },
                "progresser": {
                    "translation": "يتقدم"
                },
                "progrès": {
                    "translation": "تقدم"
                },
                "promettre": {
                    "translation": "يعد"
                },
                "propager": {
                    "translation": "ينشر"
                },
                "proportion": {
                    "translation": "تناسب"
                },
                "proposer": {
                    "translation": "يضع مقترحاً"
                },
                "propre": {
                    "translation": "نظيف"
                },
                "propriétaire": {
                    "translation": "مالك"
                },
                "prototype": {
                    "translation": "نموذج أولي"
                },
                "protéger": {
                    "translation": "يحمي"
                },
                "prudent": {
                    "translation": "حصيف"
                },
                "précis": {
                    "translation": "دقيق"
                },
                "préfيرير": {
                    "translation": "يفضل"
                },
                "présent": {
                    "translation": "حاضر"
                },
                "présenter": {
                    "translation": "يقدّم"
                },
                "présider": {
                    "translation": "يرأس"
                },
                "prévenir": {
                    "translation": "يحذّر"
                },
                "prêt": {
                    "translation": "جاهز"
                },
                "prêter": {
                    "translation": "يُقرض"
                },
                "puis": {
                    "translation": "ثم"
                },
                "puits": {
                    "translation": "بئر"
                },
                "pull": {
                    "translation": "كنزة"
                },
                "punition": {
                    "translation": "عقاب"
                },
                "pur": {
                    "translation": "نقي"
                },
                "pâte": {
                    "translation": "عجين"
                },
                "père": {
                    "translation": "أب"
                },
                "péché": {
                    "translation": "ذنب"
                },
                "pénible": {
                    "translation": "مُقلِق"
                },
                "période": {
                    "translation": "فترة"
                },
                "pêche": {
                    "translation": "خوخ"
                },
                "qualité": {
                    "translation": "جودة"
                },
                "quand": {
                    "translation": "متى"
                },
                "quantité": {
                    "translation": "كمية"
                },
                "quarante": {
                    "translation": "أربعون"
                },
                "quart": {
                    "translation": "ربع"
                },
                "quatorze": {
                    "translation": "أربعة عشر"
                },
                "quatre": {
                    "translation": "أربعة"
                },
                "quatre-vingt-dix": {
                    "translation": "تسعون"
                },
                "quatre-vingts": {
                    "translation": "ثمانون"
                },
                "que": {
                    "translation": "الذي / أن"
                },
                "quel": {
                    "translation": "أي"
                },
                "quelle": {
                    "translation": "أي"
                },
                "quelqu'un": {
                    "translation": "شخص ما"
                },
                "question": {
                    "translation": "سؤال"
                },
                "qui": {
                    "translation": "الذي"
                },
                "quinze": {
                    "translation": "خمسة عشر"
                },
                "quoi": {
                    "translation": "ماذا"
                },
                "quotidien": {
                    "translation": "يومي"
                },
                "quotidiennes": {
                    "translation": "يومية"
                },
                "racine": {
                    "translation": "جذر"
                },
                "raconter": {
                    "translation": "يحكي"
                },
                "radical": {
                    "translation": "جذري"
                },
                "radio": {
                    "translation": "راديو"
                },
                "rage": {
                    "translation": "سخط"
                },
                "raisin": {
                    "translation": "عنب"
                },
                "raison": {
                    "translation": "سبب"
                },
                "ramener": {
                    "translation": "يعيد"
                },
                "ranger": {
                    "translation": "يرتّب"
                },
                "rapide": {
                    "translation": "سريع"
                },
                "rappeler": {
                    "translation": "يتذكر"
                },
                "rapport": {
                    "translation": "تقرير"
                },
                "rarement": {
                    "translation": "نادرًا"
                },
                "raser": {
                    "translation": "يهدم"
                },
                "rassurer": {
                    "translation": "يطمئن"
                },
                "rationnel": {
                    "translation": "عقلاني"
                },
                "recevoir": {
                    "translation": "يستلم"
                },
                "recherche": {
                    "translation": "بحث"
                },
                "recommander": {
                    "translation": "يوصي"
                },
                "recommandons": {
                    "translation": "نوصي"
                },
                "rectangle": {
                    "translation": "مستطيل"
                },
                "refuser": {
                    "translation": "يرفض"
                },
                "regard": {
                    "translation": "نظرة"
                },
                "regarder": {
                    "translation": "يشاهد"
                },
                "reine": {
                    "translation": "ملكة"
                },
                "religieux": {
                    "translation": "ديني"
                },
                "remarquable": {
                    "translation": "لافت"
                },
                "remercier": {
                    "translation": "يشكر"
                },
                "rempart": {
                    "translation": "حصن"
                },
                "remplir": {
                    "translation": "يملأ"
                },
                "renard": {
                    "translation": "ثعلب"
                },
                "rencontrer": {
                    "translation": "يقابل"
                },
                "renommé": {
                    "translation": "ذائع"
                },
                "renvoyer": {
                    "translation": "يرجع"
                },
                "repos": {
                    "translation": "راحة"
                },
                "requin": {
                    "translation": "قرش"
                },
                "respectueux": {
                    "translation": "محترم"
                },
                "restaurant": {
                    "translation": "مطعم"
                },
                "reste": {
                    "translation": "يتبقّى"
                },
                "rester": {
                    "translation": "يبقى"
                },
                "revenir": {
                    "translation": "يعود"
                },
                "revoir": {
                    "translation": "مراجعة"
                },
                "reçu": {
                    "translation": "إيصال"
                },
                "riche": {
                    "translation": "غني"
                },
                "richesse": {
                    "translation": "ثروة"
                },
                "rideau": {
                    "translation": "ستارة"
                },
                "ridicule": {
                    "translation": "سخيف"
                },
                "rien": {
                    "translation": "لا شيء"
                },
                "rigide": {
                    "translation": "متيبّس"
                },
                "rincer": {
                    "translation": "يشطف"
                },
                "rire": {
                    "translation": "يضحك"
                },
                "rires": {
                    "translation": "ضحك"
                },
                "rivière": {
                    "translation": "نهر صغير"
                },
                "riz": {
                    "translation": "أرز"
                },
                "robe": {
                    "translation": "فستان"
                },
                "robuste": {
                    "translation": "متين"
                },
                "roche": {
                    "translation": "صخر"
                },
                "rocher": {
                    "translation": "صخرة"
                },
                "roi": {
                    "translation": "ملك"
                },
                "roman": {
                    "translation": "رواية"
                },
                "rond": {
                    "translation": "مستدير"
                },
                "rose": {
                    "translation": "وردي"
                },
                "rouge": {
                    "translation": "أحمر"
                },
                "rouler": {
                    "translation": "يتدحرج"
                },
                "route": {
                    "translation": "طريق"
                },
                "routine": {
                    "translation": "روتين"
                },
                "rude": {
                    "translation": "خشن"
                },
                "rue": {
                    "translation": "شارع"
                },
                "rusé": {
                    "translation": "ماكر"
                },
                "règle": {
                    "translation": "مسطرة"
                },
                "réaliste": {
                    "translation": "واقعي"
                },
                "réciproque": {
                    "translation": "متبادل"
                },
                "réciter": {
                    "translation": "يتلو"
                },
                "récits": {
                    "translation": "حكايات"
                },
                "réclamer": {
                    "translation": "يطالب"
                },
                "récompense": {
                    "translation": "مكافأة"
                },
                "réfrigérateur": {
                    "translation": "ثلاجة"
                },
                "références": {
                    "translation": "مراجع"
                },
                "région": {
                    "translation": "منطقة"
                },
                "régner": {
                    "translation": "يتولى"
                },
                "régulière": {
                    "translation": "منتظمة"
                },
                "régulièrement": {
                    "translation": "بشكل منتظم"
                },
                "répandre": {
                    "translation": "ينشر"
                },
                "réparer": {
                    "translation": "يصلح"
                },
                "répertoire": {
                    "translation": "دليل"
                },
                "répondre": {
                    "translation": "يرد"
                },
                "réponse": {
                    "translation": "جواب"
                },
                "réservoir": {
                    "translation": "خزان"
                },
                "réservé": {
                    "translation": "محجوز"
                },
                "résolu": {
                    "translation": "حازم"
                },
                "résoudre": {
                    "translation": "يحل"
                },
                "résultat": {
                    "translation": "نتيجة"
                },
                "réussir": {
                    "translation": "ينجح"
                },
                "réveil": {
                    "translation": "استيقاظ"
                },
                "révolutionnaire": {
                    "translation": "ثوري"
                },
                "révéler": {
                    "translation": "يفصّح"
                },
                "rêve": {
                    "translation": "حلم"
                },
                "rêver": {
                    "translation": "يحلم"
                },
                "rôle": {
                    "translation": "دور"
                },
                "s'il vous plaît": {
                    "translation": "من فضلك"
                },
                "sa": {
                    "translation": "خاصته (مؤنث)"
                },
                "sable": {
                    "translation": "رمل"
                },
                "sac": {
                    "translation": "حقيبة"
                },
                "sage": {
                    "translation": "حكيم"
                },
                "sagesse": {
                    "translation": "حكمة"
                },
                "sain": {
                    "translation": "صحي"
                },
                "saisir": {
                    "translation": "تفهم"
                },
                "sait": {
                    "translation": "يعرف"
                },
                "salade": {
                    "translation": "سلطة"
                },
                "salaire": {
                    "translation": "أجر"
                },
                "sale": {
                    "translation": "متسخ"
                },
                "salle-de-bain": {
                    "translation": "حمّام"
                },
                "salon": {
                    "translation": "صالة"
                },
                "salut": {
                    "translation": "مرحباً"
                },
                "samedi": {
                    "translation": "السبت"
                },
                "sandale": {
                    "translation": "صندل"
                },
                "sang": {
                    "translation": "دم"
                },
                "sanglot": {
                    "translation": "بكاء"
                },
                "sans": {
                    "translation": "بدون"
                },
                "sant": {
                    "translation": "صحي"
                },
                "santé": {
                    "translation": "صحة"
                },
                "satisfaire": {
                    "translation": "يُرضي"
                },
                "sauce": {
                    "translation": "صلصة"
                },
                "sauter": {
                    "translation": "يقفز"
                },
                "sautiller": {
                    "translation": "يقصع"
                },
                "savent": {
                    "translation": "يعرفون"
                },
                "savoir": {
                    "translation": "يعرف"
                },
                "savon": {
                    "translation": "صابون"
                },
                "scie": {
                    "translation": "منشار"
                },
                "science": {
                    "translation": "علم"
                },
                "se": {
                    "translation": "نفسه"
                },
                "se souvenir": {
                    "translation": "يتذكر"
                },
                "se tapir": {
                    "translation": "يتكوّر"
                },
                "seau": {
                    "translation": "دلو"
                },
                "seconde": {
                    "translation": "ثانية"
                },
                "secours": {
                    "translation": "إنقاذ"
                },
                "seize": {
                    "translation": "ستة عشر"
                },
                "sel": {
                    "translation": "ملح"
                },
                "selon": {
                    "translation": "وفقًا"
                },
                "semaine": {
                    "translation": "أسبوع"
                },
                "sembler": {
                    "translation": "يبدو"
                },
                "sens": {
                    "translation": "المعنى"
                },
                "sentir": {
                    "translation": "يشعر"
                },
                "sept": {
                    "translation": "سبعة"
                },
                "septembre": {
                    "translation": "سبتمبر"
                },
                "seringue": {
                    "translation": "محقنة"
                },
                "serré": {
                    "translation": "محكم"
                },
                "serveur": {
                    "translation": "نادل"
                },
                "serviette": {
                    "translation": "منشفة"
                },
                "ses": {
                    "translation": "خاصته (جمع)"
                },
                "seul": {
                    "translation": "وحيد"
                },
                "seulement": {
                    "translation": "فقط"
                },
                "si": {
                    "translation": "إذا"
                },
                "signaler": {
                    "translation": "يبلّغ"
                },
                "signe": {
                    "translation": "علامة"
                },
                "signification": {
                    "translation": "معنى"
                },
                "silence": {
                    "translation": "صمت"
                },
                "simple": {
                    "translation": "بسيط"
                },
                "simples": {
                    "translation": "بسيطة"
                },
                "singe": {
                    "translation": "قرد"
                },
                "site": {
                    "translation": "موقع"
                },
                "situation": {
                    "translation": "حالة"
                },
                "situations": {
                    "translation": "مواقف"
                },
                "six": {
                    "translation": "ستة"
                },
                "siège": {
                    "translation": "مقعد"
                },
                "soc": {
                    "translation": "جمع"
                },
                "social": {
                    "translation": "اجتماعي"
                },
                "soiffé": {
                    "translation": "عطشان"
                },
                "soir": {
                    "translation": "مساء"
                },
                "soixante": {
                    "translation": "ستون"
                },
                "soixante-dix": {
                    "translation": "سبعون"
                },
                "sol": {
                    "translation": "أرضية"
                },
                "soldat": {
                    "translation": "جندي"
                },
                "soleil": {
                    "translation": "شمس"
                },
                "solidifier": {
                    "translation": "يتصلّب"
                },
                "solitude": {
                    "translation": "وحدة"
                },
                "solution": {
                    "translation": "حل"
                },
                "sommaire": {
                    "translation": "جدول محتويات"
                },
                "sommeil": {
                    "translation": "نوم"
                },
                "sommet": {
                    "translation": "قمة"
                },
                "son": {
                    "translation": "خاصته"
                },
                "sont": {
                    "translation": "يكونون"
                },
                "sorcier": {
                    "translation": "ساحر"
                },
                "sortir": {
                    "translation": "يخرج"
                },
                "soudain": {
                    "translation": "مفاجئ"
                },
                "souffrance": {
                    "translation": "معاناة"
                },
                "soupe": {
                    "translation": "شوربة"
                },
                "soupir": {
                    "translation": "تنهيدة"
                },
                "souple": {
                    "translation": "مرن"
                },
                "source": {
                    "translation": "نبع"
                },
                "sourire": {
                    "translation": "ابتسامة"
                },
                "souris": {
                    "translation": "فأر"
                },
                "sous": {
                    "translation": "تحت"
                },
                "souvent": {
                    "translation": "غالبًا"
                },
                "spirale": {
                    "translation": "حلزون"
                },
                "spirituel": {
                    "translation": "روحي"
                },
                "sport": {
                    "translation": "رياضة"
                },
                "stable": {
                    "translation": "مستقر"
                },
                "structures": {
                    "translation": "هياكل"
                },
                "stupide": {
                    "translation": "غبي"
                },
                "style": {
                    "translation": "أسلوب"
                },
                "stylo": {
                    "translation": "قلم"
                },
                "stérile": {
                    "translation": "عقيم"
                },
                "subtil": {
                    "translation": "دقيق"
                },
                "sucre": {
                    "translation": "سكر"
                },
                "suggérer": {
                    "translation": "يقترح"
                },
                "suivre": {
                    "translation": "يتبع"
                },
                "sujets": {
                    "translation": "مواضيع"
                },
                "supermarche": {
                    "translation": "متجر كبير"
                },
                "supplier": {
                    "translation": "يتوسّل"
                },
                "sur": {
                    "translation": "على"
                },
                "surveiller": {
                    "translation": "يراقب"
                },
                "symbole": {
                    "translation": "رمز"
                },
                "symétrie": {
                    "translation": "تناظر"
                },
                "synthèse": {
                    "translation": "تركيب"
                },
                "système": {
                    "translation": "نظام"
                },
                "sève": {
                    "translation": "صمغ"
                },
                "sécheresse": {
                    "translation": "جفاف"
                },
                "séjour": {
                    "translation": "إقامة"
                },
                "série": {
                    "translation": "سلسلة"
                },
                "sérieux": {
                    "translation": "جاد"
                },
                "sûr": {
                    "translation": "آمن"
                },
                "sœur": {
                    "translation": "أخت"
                },
                "ta": {
                    "translation": "خاصتك (مؤنث)"
                },
                "table": {
                    "translation": "طاولة"
                },
                "tableau": {
                    "translation": "لوحة"
                },
                "tabouret": {
                    "translation": "كرسي بلا ظهر"
                },
                "taille": {
                    "translation": "حجم"
                },
                "talent": {
                    "translation": "موهبة"
                },
                "tante": {
                    "translation": "عمة"
                },
                "tapisser": {
                    "translation": "صينية"
                },
                "tard": {
                    "translation": "متأخر"
                },
                "tasse": {
                    "translation": "كوب"
                },
                "taxi": {
                    "translation": "سيارة أجرة"
                },
                "te": {
                    "translation": "إياك"
                },
                "technique": {
                    "translation": "أسلوب"
                },
                "temporaire": {
                    "translation": "مؤقت"
                },
                "temps": {
                    "translation": "وقت"
                },
                "température": {
                    "translation": "حرارة"
                },
                "tendance": {
                    "translation": "ميل"
                },
                "tendre": {
                    "translation": "طري"
                },
                "tenir": {
                    "translation": "يمسك"
                },
                "terrasse": {
                    "translation": "شرفة"
                },
                "terre": {
                    "translation": "أرض"
                },
                "terrible": {
                    "translation": "فظيع"
                },
                "territoire": {
                    "translation": "إقليم"
                },
                "tes": {
                    "translation": "خاصتك (جمع)"
                },
                "thé": {
                    "translation": "شاي"
                },
                "théâtre": {
                    "translation": "مسرح"
                },
                "ticket": {
                    "translation": "تذكرة"
                },
                "tiers": {
                    "translation": "ثلث"
                },
                "tigre": {
                    "translation": "نمر"
                },
                "timide": {
                    "translation": "خجول"
                },
                "tirer": {
                    "translation": "يسحب"
                },
                "toit": {
                    "translation": "سطح"
                },
                "tomate": {
                    "translation": "طماطم"
                },
                "tomber": {
                    "translation": "يسقط"
                },
                "ton": {
                    "translation": "خاصتك"
                },
                "tonne": {
                    "translation": "طن"
                },
                "tonnerre": {
                    "translation": "رعد"
                },
                "tortue": {
                    "translation": "سلحفاة"
                },
                "toucher": {
                    "translation": "يلمس"
                },
                "toujours": {
                    "translation": "دائمًا"
                },
                "touriste": {
                    "translation": "سائح"
                },
                "tous": {
                    "translation": "الجميع"
                },
                "tout": {
                    "translation": "كل"
                },
                "toute": {
                    "translation": "كل (مؤنث)"
                },
                "toutes": {
                    "translation": "كل (جمع)"
                },
                "toux": {
                    "translation": "سعال"
                },
                "traduction": {
                    "translation": "ترجمة"
                },
                "traduire": {
                    "translation": "يترجم"
                },
                "train": {
                    "translation": "قطار"
                },
                "tranchant": {
                    "translation": "حافّة"
                },
                "tranquille": {
                    "translation": "هادئ"
                },
                "transmette": {
                    "translation": "يُرسل"
                },
                "transparent": {
                    "translation": "شفاف"
                },
                "travail": {
                    "translation": "عمل"
                },
                "treize": {
                    "translation": "ثلاثة عشر"
                },
                "tremblement": {
                    "translation": "زلزال"
                },
                "trembler": {
                    "translation": "يرتجف"
                },
                "trente": {
                    "translation": "ثلاثون"
                },
                "triple": {
                    "translation": "ثلاثي"
                },
                "triste": {
                    "translation": "حزين"
                },
                "trois": {
                    "translation": "ثلاثة"
                },
                "troisième": {
                    "translation": "ثالث"
                },
                "tronc": {
                    "translation": "جذع"
                },
                "trop": {
                    "translation": "جدا"
                },
                "trouver": {
                    "translation": "يجد"
                },
                "très": {
                    "translation": "جدا"
                },
                "tu": {
                    "translation": "أنت"
                },
                "type": {
                    "translation": "نوع"
                },
                "types": {
                    "translation": "أنواع"
                },
                "tâche": {
                    "translation": "مهمة"
                },
                "téléphone": {
                    "translation": "هاتف"
                },
                "télévision": {
                    "translation": "تلفاز"
                },
                "témoin": {
                    "translation": "شاهد"
                },
                "tête": {
                    "translation": "رأس"
                },
                "tôt": {
                    "translation": "مبكر"
                },
                "un": {
                    "translation": "واحد / أداة نكرة مذكر"
                },
                "une": {
                    "translation": "واحدة / أداة نكرة مؤنث"
                },
                "unique": {
                    "translation": "فريد"
                },
                "univers": {
                    "translation": "كون"
                },
                "university": {
                    "translation": "جامعة"
                },
                "université": {
                    "translation": "جامعة"
                },
                "urgence": {
                    "translation": "استعجال"
                },
                "usage": {
                    "translation": "استخدام"
                },
                "usine": {
                    "translation": "مصنع"
                },
                "utile": {
                    "translation": "مفيد"
                },
                "utilisent": {
                    "translation": "تستخدم"
                },
                "va": {
                    "translation": "يذهب"
                },
                "vague": {
                    "translation": "موجة"
                },
                "vaincre": {
                    "translation": "يقهر"
                },
                "vais": {
                    "translation": "أذهب"
                },
                "vaisselle": {
                    "translation": "أدوات مائدة"
                },
                "valeur": {
                    "translation": "قيمة"
                },
                "valider": {
                    "translation": "يوثّق"
                },
                "valise": {
                    "translation": "حقيبة سفر"
                },
                "vallée": {
                    "translation": "وادٍ"
                },
                "valoir": {
                    "translation": "يستحق"
                },
                "vaniteux": {
                    "translation": "مغرور"
                },
                "vanité": {
                    "translation": "غرور"
                },
                "variété": {
                    "translation": "تنوع"
                },
                "vaste": {
                    "translation": "شاسع"
                },
                "vendeur": {
                    "translation": "بائع"
                },
                "vendre": {
                    "translation": "يبيع"
                },
                "vendredi": {
                    "translation": "الجمعة"
                },
                "venir": {
                    "translation": "يأتي"
                },
                "vent": {
                    "translation": "ريح"
                },
                "ventre": {
                    "translation": "معدة"
                },
                "verre": {
                    "translation": "زجاج"
                },
                "vers": {
                    "translation": "نحو"
                },
                "verser": {
                    "translation": "يصبّ"
                },
                "vert": {
                    "translation": "أخضر"
                },
                "vertu": {
                    "translation": "فضيلة"
                },
                "vertueux": {
                    "translation": "فضيل"
                },
                "veste": {
                    "translation": "سترة"
                },
                "veulent": {
                    "translation": "يريدون"
                },
                "veut": {
                    "translation": "يريد"
                },
                "viande": {
                    "translation": "لحم"
                },
                "victime": {
                    "translation": "ضحية"
                },
                "vide": {
                    "translation": "فارغ"
                },
                "vider": {
                    "translation": "يفرّغ"
                },
                "vidéo": {
                    "translation": "فيديو"
                },
                "viens": {
                    "translation": "آتي"
                },
                "vient": {
                    "translation": "يأتي"
                },
                "vieux": {
                    "translation": "عجوز"
                },
                "vigilant": {
                    "translation": "يقظ"
                },
                "village": {
                    "translation": "قرية"
                },
                "ville": {
                    "translation": "مدينة"
                },
                "vingt": {
                    "translation": "عشرون"
                },
                "violent": {
                    "translation": "عنيف"
                },
                "violet": {
                    "translation": "بنفسجي"
                },
                "visa": {
                    "translation": "تأشيرة"
                },
                "visage": {
                    "translation": "وجه"
                },
                "visible": {
                    "translation": "مرئي"
                },
                "visiter": {
                    "translation": "يزور"
                },
                "visiteur": {
                    "translation": "زائر"
                },
                "vital": {
                    "translation": "حيوي"
                },
                "vite": {
                    "translation": "بسرعة"
                },
                "vitesse": {
                    "translation": "سرعة"
                },
                "vitrail": {
                    "translation": "زجاج ملوّن"
                },
                "vivre": {
                    "translation": "يعيش"
                },
                "vocabulaire": {
                    "translation": "المفردات"
                },
                "voici": {
                    "translation": "ها هو"
                },
                "voient": {
                    "translation": "يرون"
                },
                "voilà": {
                    "translation": "ها هناك"
                },
                "voir": {
                    "translation": "يرى"
                },
                "voisin": {
                    "translation": "جار"
                },
                "voit": {
                    "translation": "يرى"
                },
                "voiture": {
                    "translation": "سيارة"
                },
                "voix": {
                    "translation": "صوت"
                },
                "volant": {
                    "translation": "عجلة قيادة"
                },
                "volcan": {
                    "translation": "بركان"
                },
                "voler": {
                    "translation": "يطير"
                },
                "volontaire": {
                    "translation": "متطوع"
                },
                "vont": {
                    "translation": "يذهبون"
                },
                "vos": {
                    "translation": "خاصكم (جمع)"
                },
                "voter": {
                    "translation": "يصوّت"
                },
                "votre": {
                    "translation": "خاصكم"
                },
                "vouloir": {
                    "translation": "يريد"
                },
                "vous": {
                    "translation": "أنتم"
                },
                "voyager": {
                    "translation": "يسافر"
                },
                "vulgaire": {
                    "translation": "عامي"
                },
                "vélo": {
                    "translation": "دراجة"
                },
                "véridique": {
                    "translation": "صادق"
                },
                "vérifier": {
                    "translation": "يتحقّق"
                },
                "vérité": {
                    "translation": "حقيقة"
                },
                "vêtement": {
                    "translation": "ملابس"
                },
                "web": {
                    "translation": "إلكتروني"
                },
                "week-end": {
                    "translation": "عطلة"
                },
                "weekend": {
                    "translation": "عطلة نهاية الأسبوع"
                },
                "yaourt": {
                    "translation": "زبادي"
                },
                "zèbre": {
                    "translation": "حمار وحشي"
                },
                "à": {
                    "translation": "إلى / في"
                },
                "à demain": {
                    "translation": "إلى اللقاء غدًا"
                },
                "âge": {
                    "translation": "عمر"
                },
                "ébahi": {
                    "translation": "مذهول"
                },
                "éblouir": {
                    "translation": "يبهر"
                },
                "échafaud": {
                    "translation": "منصّة"
                },
                "échanger": {
                    "translation": "يتبادل"
                },
                "échapper": {
                    "translation": "يتهرب"
                },
                "écharpe": {
                    "translation": "وشاح"
                },
                "échelle": {
                    "translation": "سلم / مقياس"
                },
                "échouer": {
                    "translation": "يفشل"
                },
                "échéance": {
                    "translation": "استحقاق"
                },
                "éclair": {
                    "translation": "برق"
                },
                "éclairage": {
                    "translation": "إنارة"
                },
                "éclairer": {
                    "translation": "ينير"
                },
                "éclater": {
                    "translation": "ينفجر"
                },
                "éclipse": {
                    "translation": "كسوف"
                },
                "écluse": {
                    "translation": "سد"
                },
                "école": {
                    "translation": "مدرسة"
                },
                "économe": {
                    "translation": "مقتصد"
                },
                "économie": {
                    "translation": "اقتصاد"
                },
                "écorce": {
                    "translation": "لحاء"
                },
                "écouter": {
                    "translation": "ينصت"
                },
                "écraser": {
                    "translation": "يسحق"
                },
                "écrin": {
                    "translation": "صندوق ثمين"
                },
                "écrire": {
                    "translation": "يكتب"
                },
                "écrite": {
                    "translation": "كتابي"
                },
                "écriture": {
                    "translation": "كتابة"
                },
                "écrivain": {
                    "translation": "كاتب"
                },
                "écrou": {
                    "translation": "مفتاح ربط"
                },
                "éditeur": {
                    "translation": "ناشر"
                },
                "égalité": {
                    "translation": "مساواة"
                },
                "église": {
                    "translation": "كنيسة"
                },
                "égoïsme": {
                    "translation": "أنانية"
                },
                "élaborer": {
                    "translation": "يصوغ"
                },
                "élargir": {
                    "translation": "يوسّع"
                },
                "élevage": {
                    "translation": "تربية"
                },
                "élever": {
                    "translation": "يربّي"
                },
                "éliminer": {
                    "translation": "يستبعد"
                },
                "élire": {
                    "translation": "ينتخب"
                },
                "élixir": {
                    "translation": "مرهم"
                },
                "éloquent": {
                    "translation": "فصيح"
                },
                "élève": {
                    "translation": "طالب"
                },
                "élégant": {
                    "translation": "أنيق"
                },
                "éléphant": {
                    "translation": "فيل"
                },
                "émeraude": {
                    "translation": "زمرّد"
                },
                "émerveiller": {
                    "translation": "يُبهر"
                },
                "émettre": {
                    "translation": "يبعث"
                },
                "émigration": {
                    "translation": "تهجّر"
                },
                "émigrer": {
                    "translation": "يهاجر"
                },
                "émission": {
                    "translation": "بثّ"
                },
                "ému": {
                    "translation": "متأثر"
                },
                "énergie": {
                    "translation": "طاقة"
                },
                "épaisseur": {
                    "translation": "سماكة"
                },
                "épargne": {
                    "translation": "مدخرات"
                },
                "épaule": {
                    "translation": "كتف"
                },
                "épervier": {
                    "translation": "صقر"
                },
                "éphémère": {
                    "translation": "زائل"
                },
                "épi": {
                    "translation": "سنبلة"
                },
                "épicé": {
                    "translation": "حار"
                },
                "épouvante": {
                    "translation": "رعب"
                },
                "équation": {
                    "translation": "معادلة"
                },
                "équilibre": {
                    "translation": "توازن"
                },
                "équipe": {
                    "translation": "فريق"
                },
                "équipement": {
                    "translation": "تجهيز"
                },
                "équiper": {
                    "translation": "يجهّز"
                },
                "équitation": {
                    "translation": "فروسية"
                },
                "érable": {
                    "translation": "قيقب"
                },
                "étable": {
                    "translation": "إسطبل"
                },
                "étage": {
                    "translation": "طابق"
                },
                "étagère": {
                    "translation": "رف"
                },
                "étal": {
                    "translation": "دكان"
                },
                "étalage": {
                    "translation": "عرض"
                },
                "étang": {
                    "translation": "بركة"
                },
                "état": {
                    "translation": "حالة"
                },
                "étendu": {
                    "translation": "ممتد"
                },
                "éternité": {
                    "translation": "أبدية"
                },
                "étiquette": {
                    "translation": "ملصق"
                },
                "étoile": {
                    "translation": "نجم"
                },
                "étonnant": {
                    "translation": "مدهش"
                },
                "étonner": {
                    "translation": "يفاجئ"
                },
                "étourdi": {
                    "translation": "دهشان"
                },
                "étreindre": {
                    "translation": "يعناق"
                },
                "étroit": {
                    "translation": "ضيّق"
                },
                "étude": {
                    "translation": "دراسة"
                },
                "étudiant": {
                    "translation": "طالب جامعي"
                },
                "étudier": {
                    "translation": "يدرس"
                },
                "été": {
                    "translation": "كان"
                },
                "évaluer": {
                    "translation": "يقيّم"
                },
                "évangile": {
                    "translation": "إنجيل"
                },
                "évidence": {
                    "translation": "بديهية"
                },
                "éviter": {
                    "translation": "يتجنب"
                },
                "évolution": {
                    "translation": "تطوّر"
                },
                "événement": {
                    "translation": "حدث"
                },
                "être": {
                    "translation": "يكون"
                },
                "île": {
                    "translation": "جزيرة"
                },
                "œil": {
                    "translation": "عين"
                },
                "œuf": {
                    "translation": "بيضة"
                }
            },
            "ar": {
                "أمه": {
                    "translation": "his mother"
                },
                "أيضا": {
                    "translation": "also"
                },
                "إلى": {
                    "translation": "to"
                },
                "إن": {
                    "translation": "that"
                },
                "اشترت": {
                    "translation": "bought"
                },
                "الأصفر": {
                    "translation": "yellow"
                },
                "الأكشاك": {
                    "translation": "the stalls"
                },
                "البيت": {
                    "translation": "the home"
                },
                "الحمراء": {
                    "translation": "red"
                },
                "الخضروات": {
                    "translation": "vegetables"
                },
                "السلة": {
                    "translation": "the basket"
                },
                "السوق": {
                    "translation": "the market"
                },
                "القديم": {
                    "translation": "the old"
                },
                "الكتب": {
                    "translation": "the books"
                },
                "المستعملة": {
                    "translation": "used"
                },
                "المكان": {
                    "translation": "the place"
                },
                "بائع": {
                    "translation": "vendor"
                },
                "بالحياة": {
                    "translation": "with life"
                },
                "بالطماطم": {
                    "translation": "with tomatoes"
                },
                "بصوت": {
                    "translation": "in a voice"
                },
                "بضاعته": {
                    "translation": "his goods"
                },
                "بل": {
                    "translation": "but"
                },
                "تحمل": {
                    "translation": "carrying"
                },
                "توقفت": {
                    "translation": "stopped"
                },
                "ثقيل": {
                    "translation": "heavy"
                },
                "ثم": {
                    "translation": "then"
                },
                "حمل": {
                    "translation": "carried"
                },
                "خبز": {
                    "translation": "bread"
                },
                "ذهبت": {
                    "translation": "went"
                },
                "سمعت": {
                    "translation": "heard"
                },
                "صباح": {
                    "translation": "morning"
                },
                "صغير": {
                    "translation": "small"
                },
                "طازج": {
                    "translation": "fresh"
                },
                "طفل": {
                    "translation": "child"
                },
                "عادت": {
                    "translation": "returned"
                },
                "عال": {
                    "translation": "high"
                },
                "على": {
                    "translation": "on"
                },
                "عند": {
                    "translation": "at"
                },
                "فقط": {
                    "translation": "only"
                },
                "في": {
                    "translation": "in"
                },
                "قالت": {
                    "translation": "she said"
                },
                "قديم": {
                    "translation": "old"
                },
                "كان": {
                    "translation": "was"
                },
                "كانت": {
                    "translation": "was"
                },
                "كشك": {
                    "translation": "stall"
                },
                "كيس": {
                    "translation": "bag"
                },
                "لبيع": {
                    "translation": "for selling"
                },
                "لشراء": {
                    "translation": "to buy"
                },
                "للشراء": {
                    "translation": "for buying"
                },
                "للقصص": {
                    "translation": "for stories"
                },
                "ليس": {
                    "translation": "is not"
                },
                "ليلى": {
                    "translation": "Layla"
                },
                "مزدحم": {
                    "translation": "crowded"
                },
                "مشمس": {
                    "translation": "sunny"
                },
                "مكان": {
                    "translation": "place"
                },
                "مليئة": {
                    "translation": "full"
                },
                "نعناع": {
                    "translation": "mint"
                },
                "والليمون": {
                    "translation": "and lemons"
                },
                "وحزمة": {
                    "translation": "and a bunch"
                },
                "ورأت": {
                    "translation": "and saw"
                },
                "وكتاب": {
                    "translation": "and a book"
                },
                "وهي": {
                    "translation": "while she"
                },
                "يساعد": {
                    "translation": "helps"
                },
                "ينادي": {
                    "translation": "calls out"
                }
            }
        },
        "phrases": {
            "en": {},
            "fr": {
                "au revoir": {
                    "translation": "وداعًا"
                },
                "bonne nuit": {
                    "translation": "تصبح على خير"
                },
                "s'il vous plaît": {
                    "translation": "من فضلك"
                },
                "se souvenir": {
                    "translation": "يتذكر"
                },
                "se tapir": {
                    "translation": "يتكوّر"
                },
                "à demain": {
                    "translation": "إلى اللقاء غدًا"
                }
            }
        },
        "stories": {
            "1": {
                "en": {
                    "hello": {
                        "translation": "مرحبًا"
                    },
                    "and": {
                        "translation": "و"
                    },
                    "welcome": {
                        "translation": "أهلاً بك"
                    },
                    "to": {
                        "translation": "إلى"
                    },
                    "istories": {
                        "translation": "آي ستوريس"
                    },
                    "this": {
                        "translation": "هذا"
                    },
                    "website": {
                        "translation": "موقع"
                    },
                    "was": {
                        "translation": "كان"
                    },
                    "created": {
                        "translation": "تم إنشاؤه"
                    },
                    "by": {
                        "translation": "بواسطة"
                    },
                    "ammar": {
                        "translation": "عمّار"
                    },
                    "chacal": {
                        "translation": "شاكال"
                    },
                    "help": {
                        "translation": "مساعدة"
                    },
                    "people": {
                        "translation": "الناس"
                    },
                    "learn": {
                        "translation": "يتعلمون"
                    },
                    "languages": {
                        "translation": "اللغات"
                    },
                    "in": {
                        "translation": "في"
                    },
                    "a": {
                        "translation": "ـ"
                    },
                    "fun": {
                        "translation": "ممتعة"
                    },
                    "engaging": {
                        "translation": "جذّابة"
                    },
                    "way": {
                        "translation": "طريقة"
                    },
                    "through": {
                        "translation": "من خلال"
                    },
                    "these": {
                        "translation": "هذه"
                    },
                    "interactive": {
                        "translation": "تفاعلية"
                    },
                    "stories": {
                        "translation": "القصص"
                    },
                    "you": {
                        "translation": "أنت"
                    },
                    "can": {
                        "translation": "تستطيع"
                    },
                    "improve": {
                        "translation": "تحسّن"
                    },
                    "your": {
                        "translation": "مهاراتك"
                    },
                    "vocabulary": {
                        "translation": "المفردات"
                    },
                    "comprehension": {
                        "translation": "الفهم"
                    },
                    "skills": {
                        "translation": "المهارات"
                    },
                    "naturally": {
                        "translation": "بشكل طبيعي"
                    },
                    "each": {
                        "translation": "كل"
                    },
                    "story": {
                        "translation": "قصة"
                    },
                    "is": {
                        "translation": "هي"
                    },
                    "designed": {
                        "translation": "مصممة"
                    },
                    "for": {
                        "translation": "لـ"
                    },
                    "different": {
                        "translation": "مختلفة"
                    },
                    "learning": {
                        "translation": "التعلم"
                    },
                    "levels": {
                        "translation": "المستويات"
                    },
                    "beginner": {
                        "translation": "مبتدئ"
                    },
                    "intermediate": {
                        "translation": "متوسط"
                    },
                    "advanced": {
                        "translation": "متقدم"
                    },
                    "use": {
                        "translation": "تستخدم"
                    },
                    "simple": {
                        "translation": "بسيطة"
                    },
                    "words": {
                        "translation": "كلمات"
                    },
                    "short": {
                        "translation": "قصيرة"
                    },
                    "sentences": {
                        "translation": "جمل"
                    },
                    "perfect": {
                        "translation": "مثالية"
                    },
                    "those": {
                        "translation": "الذين"
                    },
                    "just": {
                        "translation": "فقط"
                    },
                    "starting": {
                        "translation": "يبدؤون"
                    },
                    "their": {
                        "translation": "رحلتهم"
                    },
                    "journey": {
                        "translation": "الرحلة"
                    },
                    "as": {
                        "translation": "بينما"
                    },
                    "read": {
                        "translation": "تقرأ"
                    },
                    "click": {
                        "translation": "اضغط"
                    },
                    "on": {
                        "translation": "على"
                    },
                    "any": {
                        "translation": "أي"
                    },
                    "word": {
                        "translation": "كلمة"
                    },
                    "see": {
                        "translation": "لتشاهد"
                    },
                    "its": {
                        "translation": "ترجمتها"
                    },
                    "translation": {
                        "translation": "ترجمة"
                    },
                    "definition": {
                        "translation": "تعريف"
                    },
                    "feature": {
                        "translation": "ميزة"
                    },
                    "helps": {
                        "translation": "تساعد"
                    },
                    "new": {
                        "translation": "جديدة"
                    },
                    "context": {
                        "translation": "السياق"
                    },
                    "much": {
                        "translation": "أكثر"
                    },
                    "effective": {
                        "translation": "فعالية"
                    },
                    "than": {
                        "translation": "من"
                    },
                    "memorizing": {
                        "translation": "حفظ"
                    },
                    "lists": {
                        "translation": "قوائم"
                    },
                    "cover": {
                        "translation": "تغطي"
                    },
                    "various": {
                        "translation": "متنوعة"
                    },
                    "topics": {
                        "translation": "مواضيع"
                    },
                    "genres": {
                        "translation": "أنواع"
                    },
                    "from": {
                        "translation": "من"
                    },
                    "everyday": {
                        "translation": "يومية"
                    },
                    "situations": {
                        "translation": "مواقف"
                    },
                    "exciting": {
                        "translation": "ممتعة"
                    },
                    "adventures": {
                        "translation": "مغامرات"
                    },
                    "variety": {
                        "translation": "التنوّع"
                    },
                    "ensures": {
                        "translation": "يضمن"
                    },
                    "encounter": {
                        "translation": "مواجهة"
                    },
                    "types": {
                        "translation": "أنواع"
                    },
                    "sentence": {
                        "translation": "جملة"
                    },
                    "structures": {
                        "translation": "تراكيب"
                    },
                    "reading": {
                        "translation": "القراءة"
                    },
                    "regularly": {
                        "translation": "بانتظام"
                    },
                    "one": {
                        "translation": "واحدة"
                    },
                    "best": {
                        "translation": "أفضل"
                    },
                    "ways": {
                        "translation": "طرق"
                    },
                    "practice": {
                        "translation": "تدرب"
                    },
                    "while": {
                        "translation": "أثناء"
                    },
                    "enjoying": {
                        "translation": "الاستمتاع"
                    },
                    "interesting": {
                        "translation": "شيّقة"
                    },
                    "narratives": {
                        "translation": "سرديات"
                    },
                    "remember": {
                        "translation": "تذكر"
                    },
                    "that": {
                        "translation": "أن"
                    },
                    "takes": {
                        "translation": "يأخذ"
                    },
                    "time": {
                        "translation": "وقتًا"
                    },
                    "patience": {
                        "translation": "صبرًا"
                    },
                    "don't": {
                        "translation": "لا"
                    },
                    "worry": {
                        "translation": "تقلق"
                    },
                    "understand": {
                        "translation": "تفهم"
                    },
                    "every": {
                        "translation": "كل"
                    },
                    "first": {
                        "translation": "أولاً"
                    },
                    "try": {
                        "translation": "حاول"
                    },
                    "general": {
                        "translation": "العام"
                    },
                    "meaning": {
                        "translation": "المعنى"
                    },
                    "paragraph": {
                        "translation": "فقرة"
                    },
                    "we": {
                        "translation": "نحن"
                    },
                    "recommend": {
                        "translation": "نوصي"
                    },
                    "day": {
                        "translation": "يوم"
                    },
                    "reviewing": {
                        "translation": "مراجعة"
                    },
                    "consistent": {
                        "translation": "الاستمرارية"
                    },
                    "key": {
                        "translation": "مفتاح"
                    },
                    "making": {
                        "translation": "تحقيق"
                    },
                    "progress": {
                        "translation": "تقدم"
                    },
                    "thank": {
                        "translation": "شكرًا"
                    },
                    "choosing": {
                        "translation": "اختيار"
                    },
                    "hope": {
                        "translation": "نأمل"
                    },
                    "enjoy": {
                        "translation": "تستمتع"
                    },
                    "find": {
                        "translation": "تجد"
                    },
                    "them": {
                        "translation": "إياها"
                    },
                    "helpful": {
                        "translation": "مفيدة"
                    },
                    "achieving": {
                        "translation": "تحقيق"
                    },
                    "goals": {
                        "translation": "أهدافك"
                    },
                    "language": {
                        "translation": "لغة"
                    },
                    "the": {
                        "translation": "ال"
                    },
                    "of": {
                        "translation": "من"
                    },
                    "at": {
                        "translation": "في"
                    },
                    "click-to-translate": {
                        "translation": "انقر للترجمة"
                    },
                    "if": {
                        "translation": "إذا"
                    },
                    "with": {
                        "translation": "مع"
                    },
                    "more": {
                        "translation": "أكثر"
                    },
                    "which": {
                        "translation": "الذي"
                    }
                }
            },
            "4": {
                "fr": {
                    "bonjour": {
                        "translation": "مرحبًا"
                    },
                    "bienvenue": {
                        "translation": "أهلاً بك"
                    },
                    "sur": {
                        "translation": "على"
                    },
                    "ce": {
                        "translation": "هذا"
                    },
                    "site": {
                        "translation": "موقع"
                    },
                    "web": {
                        "translation": "إلكتروني"
                    },
                    "a": {
                        "translation": "لديه / فعل مساعد"
                    },
                    "été": {
                        "translation": "تم"
                    },
                    "créé": {
                        "translation": "إنشاؤه"
                    },
                    "par": {
                        "translation": "بواسطة"
                    },
                    "pour": {
                        "translation": "لكي"
                    },
                    "aider": {
                        "translation": "يساعد"
                    },
                    "les": {
                        "translation": "الـ (جمع)"
                    },
                    "gens": {
                        "translation": "الناس"
                    },
                    "à": {
                        "translation": "إلى"
                    },
                    "apprendre": {
                        "translation": "يتعلم"
                    },
                    "langues": {
                        "translation": "لغات"
                    },
                    "de": {
                        "translation": "من / لـ"
                    },
                    "manière": {
                        "translation": "طريقة"
                    },
                    "amusante": {
                        "translation": "ممتعة"
                    },
                    "et": {
                        "translation": "و"
                    },
                    "interactive": {
                        "translation": "تفاعلية"
                    },
                    "grâce": {
                        "translation": "بفضل"
                    },
                    "ces": {
                        "translation": "هذه"
                    },
                    "histoires": {
                        "translation": "قصص"
                    },
                    "vous": {
                        "translation": "أنت / أنتم"
                    },
                    "pouvez": {
                        "translation": "يمكنك"
                    },
                    "améliorer": {
                        "translation": "تحسن"
                    },
                    "naturellement": {
                        "translation": "بطبيعة"
                    },
                    "vocabulaire": {
                        "translation": "المفردات"
                    },
                    "compréhension": {
                        "translation": "الفهم"
                    },
                    "chaque": {
                        "translation": "كل"
                    },
                    "histoire": {
                        "translation": "قصة"
                    },
                    "est": {
                        "translation": "هي"
                    },
                    "conçue": {
                        "translation": "مصممة"
                    },
                    "différents": {
                        "translation": "مختلفة"
                    },
                    "niveaux": {
                        "translation": "المستويات"
                    },
                    "d’apprentissage": {
                        "translation": "التعلم"
                    },
                    "débutant": {
                        "translation": "مبتدئ"
                    },
                    "intermédiaire": {
                        "translation": "متوسط"
                    },
                    "avancé": {
                        "translation": "متقدم"
                    },
                    "utilisent": {
                        "translation": "تستخدم"
                    },
                    "mots": {
                        "translation": "كلمات"
                    },
                    "simples": {
                        "translation": "بسيطة"
                    },
                    "phrases": {
                        "translation": "جمل"
                    },
                    "courtes": {
                        "translation": "قصيرة"
                    },
                    "parfaites": {
                        "translation": "مثالية"
                    },
                    "ceux": {
                        "translation": "أولئك"
                    },
                    "qui": {
                        "translation": "الذين"
                    },
                    "commencent": {
                        "translation": "يبدؤون"
                    },
                    "parcours": {
                        "translation": "مسار"
                    },
                    "en": {
                        "translation": "في"
                    },
                    "lisant": {
                        "translation": "قارئ"
                    },
                    "cliquez": {
                        "translation": "انقر"
                    },
                    "n’importe": {
                        "translation": "أي"
                    },
                    "quel": {
                        "translation": "أي"
                    },
                    "mot": {
                        "translation": "كلمة"
                    },
                    "voir": {
                        "translation": "يرى"
                    },
                    "sa": {
                        "translation": "له / لها"
                    },
                    "traduction": {
                        "translation": "ترجمة"
                    },
                    "définition": {
                        "translation": "تعريف"
                    },
                    "fonctionnalité": {
                        "translation": "ميزة"
                    },
                    "aide": {
                        "translation": "تساعد"
                    },
                    "contexte": {
                        "translation": "السياق"
                    },
                    "bien": {
                        "translation": "جيد"
                    },
                    "plus": {
                        "translation": "أكثر"
                    },
                    "efficace": {
                        "translation": "فعّال"
                    },
                    "que": {
                        "translation": "من"
                    },
                    "mémoriser": {
                        "translation": "يحفظ"
                    },
                    "listes": {
                        "translation": "قوائم"
                    },
                    "couvrent": {
                        "translation": "تغطي"
                    },
                    "divers": {
                        "translation": "متنوع"
                    },
                    "sujets": {
                        "translation": "مواضيع"
                    },
                    "genres": {
                        "translation": "أنواع"
                    },
                    "allant": {
                        "translation": "تذهب"
                    },
                    "situations": {
                        "translation": "مواقف"
                    },
                    "quotidiennes": {
                        "translation": "يومية"
                    },
                    "assure": {
                        "translation": "تضمن"
                    },
                    "rencontrer": {
                        "translation": "يواجه"
                    },
                    "types": {
                        "translation": "أنواع"
                    },
                    "structures": {
                        "translation": "هياكل"
                    },
                    "grammaticales": {
                        "translation": "نحوية"
                    },
                    "lire": {
                        "translation": "يقرأ"
                    },
                    "régulièrement": {
                        "translation": "بشكل منتظم"
                    },
                    "meilleurs": {
                        "translation": "أفضل"
                    },
                    "moyens": {
                        "translation": "طرق"
                    },
                    "compétences": {
                        "translation": "مهارات"
                    },
                    "linguistiques": {
                        "translation": "لغوية"
                    },
                    "pratiquer": {
                        "translation": "يمارس"
                    },
                    "écrite": {
                        "translation": "كتابي"
                    },
                    "profitant": {
                        "translation": "مستفيدًا / مستمتعًا"
                    },
                    "récits": {
                        "translation": "حكايات"
                    },
                    "intéressants": {
                        "translation": "ممتعة"
                    },
                    "n’oubliez": {
                        "translation": "لا تنسوا"
                    },
                    "demande": {
                        "translation": "يتطلب"
                    },
                    "temps": {
                        "translation": "وقت"
                    },
                    "patience": {
                        "translation": "صبر"
                    },
                    "inquiétez": {
                        "translation": "تقلق"
                    },
                    "comprenez": {
                        "translation": "تفهم"
                    },
                    "début": {
                        "translation": "بداية"
                    },
                    "essayez": {
                        "translation": "حاول"
                    },
                    "saisir": {
                        "translation": "تفهم"
                    },
                    "sens": {
                        "translation": "المعنى"
                    },
                    "général": {
                        "translation": "عام"
                    },
                    "paragraphe": {
                        "translation": "فقرة"
                    },
                    "recommandons": {
                        "translation": "نوصي"
                    },
                    "jour": {
                        "translation": "يوم"
                    },
                    "revoir": {
                        "translation": "مراجعة"
                    },
                    "pratique": {
                        "translation": "ممارسة"
                    },
                    "clé": {
                        "translation": "مفتاح"
                    },
                    "progresser": {
                        "translation": "يتقدم"
                    },
                    "espérons": {
                        "translation": "نأمل"
                    },
                    "plairont": {
                        "translation": "تعجبكم"
                    },
                    "istories": {
                        "translation": "قصص"
                    },
                    "ammar": {
                        "translation": "عمار"
                    },
                    "chacal": {
                        "translation": "شقل"
                    },
                    "votre": {
                        "translation": "لك / خاصتكم"
                    },
                    "linguistique": {
                        "translation": "لغوي"
                    },
                    "leur": {
                        "translation": "لهم / خاصتهم"
                    },
                    "cliquer": {
                        "translation": "النقر"
                    },
                    "du": {
                        "translation": "من / بعض"
                    },
                    "passionnantes": {
                        "translation": "مثيرة"
                    },
                    "d’améliorer": {
                        "translation": "لتحسين"
                    },
                    "aventures": {
                        "translation": "مغامرات"
                    },
                    "avec": {
                        "translation": "مع"
                    },
                    "l’apprentissage": {
                        "translation": "التعلم"
                    },
                    "d'apprentissage": {
                        "translation": "التعلم"
                    },
                    "quelle": {
                        "translation": "أي"
                    },
                    "aideront": {
                        "translation": "ستساعد"
                    },
                    "choisi": {
                        "translation": "اختار"
                    },
                    "atteindre": {
                        "translation": "بلوغ / تحقيق"
                    },
                    "merci": {
                        "translation": "شكرًا"
                    },
                    "d’avoir": {
                        "translation": "لأنك امتلكت / لأنك فعلت"
                    },
                    "nous": {
                        "translation": "نحن"
                    },
                    "régulière": {
                        "translation": "منتظمة"
                    },
                    "objectifs": {
                        "translation": "أهداف"
                    },
                    "vos": {
                        "translation": "خاصتكم"
                    },
                    "langue": {
                        "translation": "لغة"
                    },
                    "d’une": {
                        "translation": "لواحدة / لأحدى"
                    },
                    "pas": {
                        "translation": "لا / خطوة"
                    },
                    "si": {
                        "translation": "إذا / نعم"
                    },
                    "au": {
                        "translation": "إلى الـ / في الـ"
                    },
                    "la": {
                        "translation": "الـ (أداة تعريف مؤنث)"
                    },
                    "ne": {
                        "translation": "لا (نفي)"
                    },
                    "tout": {
                        "translation": "كل"
                    },
                    "l’un": {
                        "translation": "الواحد"
                    },
                    "variété": {
                        "translation": "تنوع"
                    },
                    "cette": {
                        "translation": "هذه"
                    },
                    "aux": {
                        "translation": "إلى الـ (جمع)"
                    },
                    "une": {
                        "translation": "واحدة / أحدى"
                    },
                    "dans": {
                        "translation": "في"
                    },
                    "le": {
                        "translation": "الـ (أداة تعريف مذكر)"
                    },
                    "appris": {
                        "translation": "تعلَّمَ / عَرَفَ"
                    },
                    "débutants": {
                        "translation": "مبتدئون"
                    }
                }
            }
        }
    }
};
