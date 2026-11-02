import { bi, type MinistryGuide } from './types';

export const community: MinistryGuide[] = [
  {
    n: 7, slug: 'community-learning',
    ministry: bi('Cults and Religions', 'ក្រសួងធម្មការ និងសាសនា'),
    title: bi('Community Learning Network', 'បណ្ដាញសិក្សាសហគមន៍'),
    benefit: bi('A pagoda, mosque, church or community hall can offer a nearby place to learn. When hosts publish the subject, language and access arrangements, families can decide which sessions suit them before travelling.', 'វត្ត វិហារឥស្លាម វិហារគ្រិស្ត ឬសាលាសហគមន៍អាចជាកន្លែងរៀននៅជិតផ្ទះ។ បើអ្នករៀបចំប្រាប់ពីមុខវិជ្ជា ភាសា និងលទ្ធភាពចូលរួម គ្រួសារអាចសម្រេចចិត្តមុនពេលធ្វើដំណើរ។'),
    steps: [
      bi('Choose a practical activity, such as a Khmer reading circle or a phone-skills lesson. Ask the venue for permission to host it.', 'ជ្រើសរើសសកម្មភាពជាក់ស្តែង ដូចជាក្រុមអានភាសាខ្មែរ ឬមេរៀនប្រើទូរសព្ទ។ សុំការអនុញ្ញាតពីអ្នកគ្រប់គ្រងទីតាំង។'),
      bi('Agree on a date, language, accessible entrance and whether supplies are available. Ask how people of different beliefs can participate comfortably.', 'កំណត់ថ្ងៃ ភាសា ច្រកចូលសម្រាប់អ្នកពិបាកធ្វើដំណើរ និងសម្ភារៈដែលមាន។ សួរថាតើអ្នកមានជំនឿផ្សេងៗអាចចូលរួមបានយ៉ាងដូចម្តេច។'),
      bi('Invite a volunteer reader and offer large-print Khmer texts. Ask each participant to listen without interrupting and allow everyone to pass on religious questions.', 'អញ្ជើញអ្នកស្ម័គ្រចិត្តមកអាន និងរៀបចំអត្ថបទខ្មែរដែលមានអក្សរធំ។ ស្នើឱ្យអ្នកចូលរួមស្តាប់គ្នាដោយមិនកាត់សម្តី និងអាចសុំរំលងសំណួរសាសនា។'),
      bi('Share a notice with the host’s approval. Include a public contact and a way to confirm the time.', 'ក្រោយពីអ្នករៀបចំយល់ព្រម សូមចែកសេចក្តីជូនដំណឹងដោយមានទំនាក់ទំនងសាធារណៈសម្រាប់បញ្ជាក់ពេលវេលា។'),
    ],
    links: [
      { label: bi('Wat Damnak, Siem Reap · free public reading at the Center for Khmer Studies library', 'វត្តដំណាក់ សៀមរាប · អានសៀវភៅដោយឥតគិតថ្លៃនៅបណ្ណាល័យមជ្ឈមណ្ឌលខេមរសិក្សា'), url: 'https://khmerstudies.org/library/' },
      { label: bi('Kroper village, Siem Reap · ask VBCCC about storytime, group reading and volunteer roles', 'ភូមិក្រពើ ខេត្តសៀមរាប · សួរមជ្ឈមណ្ឌល VBCCC អំពីការនិទានរឿង ការអានជាក្រុម និងការងារស្ម័គ្រចិត្ត'), url: 'https://www.vbccc.org/program-detail.html?name=library-program-vbccc-volunteer-teaching-reading' },
      { label: bi('Ministry of Cult and Religion', 'ក្រសួងធម្មការ និងសាសនា'), url: 'https://mocar.gov.kh/' },
      { label: bi('Khmer One learning activities', 'សកម្មភាពសិក្សារបស់ខ្មែរ វ័ន'), url: '/learning' },
    ],
    prompts: [
      bi('Topic and activity people can try', 'ប្រធានបទ និងសកម្មភាពដែលអាចសាកល្បង'),
      bi('Venue, time and language confirmed by the host', 'ទីតាំង ពេលវេលា និងភាសាដែលអ្នករៀបចំបានបញ្ជាក់'),
      bi('Materials and access arrangements', 'សម្ភារៈ និងការរៀបចំសម្រាប់ការចូលរួម'),
    ],
  },
  {
    n: 8, slug: 'farmer-learning',
    ministry: bi('Agriculture, Forestry and Fisheries', 'ក្រសួងកសិកម្ម រុក្ខាប្រមាញ់ និងនេសាទ'),
    title: bi('Farmer Learning Companion', 'ជំនួយការសិក្សាសម្រាប់កសិករ'),
    benefit: bi('A crop calendar linked to field observations can help families plan labour and storage before harvest. Comparing buyers’ dated prices after transport costs makes the choice of market clearer.', 'ប្រតិទិនដំណាំដែលភ្ជាប់នឹងការសង្កេតក្នុងស្រែចម្ការអាចជួយគ្រួសាររៀបចំកម្លាំងការងារ និងកន្លែងស្តុកមុនពេលប្រមូលផល។ ការប្រៀបធៀបតម្លៃដែលអ្នកទិញផ្តល់តាមកាលបរិច្ឆេទ ក្រោយដកថ្លៃដឹកជញ្ជូន ជួយក្នុងការជ្រើសរើសទីផ្សារ។'),
    steps: [
      bi('Choose a crop guide from the agriculture e-library. Mark expected planting, field checks and harvest on a calendar for your variety and province.', 'ជ្រើសរើសសៀវភៅណែនាំដំណាំពីបណ្ណាល័យកសិកម្ម។ កត់ពេលដាំ ពេលពិនិត្យស្រែចម្ការ និងពេលប្រមូលផលតាមពូជដំណាំ និងខេត្តរបស់អ្នក។'),
      bi('Record soil moisture and access to water. Ask a commune agriculture officer how these observations affect this season’s plan.', 'កត់សំណើមដី និងប្រភពទឹកដែលអាចប្រើបាន។ សួរមន្ត្រីកសិកម្មឃុំថាកត្តាទាំងនេះប៉ះពាល់ដល់ផែនការរដូវនេះយ៉ាងដូចម្តេច។'),
      bi('Check the guide’s drying and storage instructions before harvest. Ask two buyers for prices on the same date, for the same unit and grade.', 'ពិនិត្យវិធីសម្ងួត និងស្តុកក្នុងសៀវភៅណែនាំមុនប្រមូលផល។ សួរតម្លៃពីអ្នកទិញពីរនាក់នៅថ្ងៃតែមួយ ដោយប្រើឯកតា និងកម្រិតគុណភាពដូចគ្នា។'),
    ],
    links: [
      { label: bi('ARDB commodity price bulletins · check the report date and compare local offers', 'របាយការណ៍តម្លៃកសិផលរបស់ធនាគារ ARDB · ពិនិត្យថ្ងៃចេញផ្សាយ និងប្រៀបធៀបតម្លៃដែលអ្នកទិញនៅមូលដ្ឋានផ្ដល់ឱ្យ'), url: 'https://www.ardb.com.kh/publication/commodity-prices/' },
      { label: bi('MAFF Khmer agriculture e-library', 'បណ្ណាល័យអេឡិចត្រូនិកកសិកម្ម'), url: 'https://elibrary.maff.gov.kh/' },
      { label: bi('Cam Agri Hub tools and extension resources', 'ឧបករណ៍ និងធនធានផ្សព្វផ្សាយកសិកម្ម'), url: 'https://pcrl.maff.gov.kh/' },
    ],
    prompts: [
      bi('Crop, variety and seasonal calendar', 'ដំណាំ ពូជ និងប្រតិទិនតាមរដូវ'),
      bi('Soil and water observations to discuss', 'ការសង្កេតអំពីដី និងទឹកសម្រាប់ពិភាក្សា'),
      bi('Drying or storage task before harvest', 'ការត្រៀមសម្ងួត ឬស្តុកមុនប្រមូលផល'),
      bi('Buyer quotes, unit, date and transport cost', 'តម្លៃពីអ្នកទិញ ឯកតា កាលបរិច្ឆេទ និងថ្លៃដឹកជញ្ជូន'),
    ],
  },
  {
    n: 9, slug: 'village-infrastructure',
    ministry: bi('Rural Development', 'ក្រសួងអភិវឌ្ឍន៍ជនបទ'),
    title: bi('Village Infrastructure Map', 'ផែនទីហេដ្ឋារចនាសម្ព័ន្ធភូមិ'),
    benefit: bi('A commune can compare a broken shared pump with a washed-out road by recording who uses each one and which services are cut off. A dated follow-up helps residents check whether the repair restored access.', 'ឃុំអាចប្រៀបធៀបតម្រូវការជួសជុលស្នប់ទឹកសាធារណៈ និងផ្លូវដែលខូចដោយសារទឹកហូរ ដោយកត់ថាអ្នកណាប្រើប្រាស់ និងសេវាណាខ្លះដែលមិនអាចទៅដល់។ កាលបរិច្ឆេទតាមដានជួយពលរដ្ឋពិនិត្យថាតើអាចប្រើប្រាស់វិញបានឬនៅ។'),
    steps: [
      bi('Look up the commune on WellMap or the government map. For a shared well, school toilet, road or bridge, use a public landmark to describe the location.', 'ស្វែងរកឃុំនៅលើផែនទីអណ្ដូងទឹក ឬផែនទីរដ្ឋាភិបាល។ សម្រាប់អណ្ដូងរួម បង្គន់សាលា ផ្លូវ ឬស្ពាន សូមប្រើទីសម្គាល់សាធារណៈដើម្បីពណ៌នាទីតាំង។'),
      bi('Check the record date. Ask the caretaker about access and the latest inspection. A mapped well still needs a current water-quality check before anyone relies on it for drinking.', 'ពិនិត្យកាលបរិច្ឆេទកំណត់ត្រា។ សួរអ្នកថែទាំអំពីការចូលប្រើ និងការត្រួតពិនិត្យចុងក្រោយ។ មុនប្រើទឹកអណ្ដូងសម្រាប់ផឹក សូមផ្ទៀងផ្ទាត់លទ្ធផលតេស្តគុណភាពទឹកបច្ចុប្បន្ន។'),
      bi('Describe the repair needed to the commune or responsible office. Record who will check progress, when to follow up and whether access has been restored.', 'ជម្រាបឃុំ ឬការិយាល័យទទួលបន្ទុកអំពីការជួសជុលដែលត្រូវការ។ កត់អ្នកតាមដាន កាលបរិច្ឆេទតាមដាន និងថាតើអាចប្រើប្រាស់វិញបានឬនៅ។'),
    ],
    links: [
      { label: bi('MRD WellMap by commune', 'ផែនទីប្រភពទឹកតាមឃុំ'), url: 'https://cambodiawellmap.com/worldbank/maps/44786/water-supply-by-commune' },
      { label: bi('Cambodia commune map', 'ផែនទីឃុំ និងសង្កាត់នៅកម្ពុជា'), url: 'https://data.mef.gov.kh/datasets/pd_66c2f89949eb6c00013c1385' },
      { label: bi('Cambodian road network and responsible agencies', 'បណ្ដាញផ្លូវនៅកម្ពុជា និងស្ថាប័នទទួលបន្ទុក'), url: 'https://logistics.gov.kh/en/sectors/infra-sectors/roads' },
    ],
    prompts: [
      bi('Public asset and nearest landmark', 'សម្បត្តិសាធារណៈ និងទីសម្គាល់នៅជិតបំផុត'),
      bi('Condition, date checked and who is affected', 'ស្ថានភាព ថ្ងៃពិនិត្យ និងអ្នករងផលប៉ះពាល់'),
      bi('Maintenance request and responsible office', 'សំណើថែទាំ និងការិយាល័យទទួលបន្ទុក'),
      bi('Follow-up date and repair status', 'ថ្ងៃតាមដាន និងស្ថានភាពជួសជុល'),
    ],
  },
  {
    n: 10, slug: 'weather-and-water',
    ministry: bi('Water Resources and Meteorology', 'ក្រសួងធនធានទឹក និងឧតុនិយម'),
    title: bi('Weather and Water Hub', 'មជ្ឈមណ្ឌលព័ត៌មានអាកាសធាតុ និងទឹក'),
    benefit: bi('A teacher or grower can compare the provincial forecast with the nearest river station before moving books or equipment to higher storage. Writing down the next update time helps a family revisit its plan when conditions change.', 'គ្រូបង្រៀន ឬកសិករអាចផ្ទៀងផ្ទាត់ការព្យាករណ៍តាមខេត្តជាមួយទិន្នន័យស្ថានីយជលសាស្ត្រនៅជិត មុនផ្លាស់សៀវភៅ ឬឧបករណ៍ទៅទីខ្ពស់។ ការកត់ពេលចេញព័ត៌មានបន្ទាប់ជួយគ្រួសារកែផែនការពេលស្ថានភាពប្រែប្រួល។'),
    steps: [
      bi('Open the provincial forecast and record its issue time and the period it covers. Check local official announcements for warnings and instructions.', 'បើកការព្យាករណ៍តាមខេត្ត កត់ពេលចេញផ្សាយ និងរយៈពេលដែលបានព្យាករណ៍។ ពិនិត្យសេចក្តីជូនដំណឹងផ្លូវការក្នុងមូលដ្ឋានសម្រាប់ការព្រមាន និងការណែនាំ។'),
      bi('Select a relevant river station. Check its name, date, unit and trend. A gauge measures its own location; water depth at a particular house or road can differ.', 'ជ្រើសស្ថានីយជលសាស្ត្រដែលពាក់ព័ន្ធ។ ពិនិត្យឈ្មោះ កាលបរិច្ឆេទ ឯកតា និងនិន្នាការ។ ស្ថានីយវាស់នៅទីតាំងរបស់វា ហើយជម្រៅទឹកនៅផ្ទះ ឬផ្លូវអាចខុសគ្នា។'),
      bi('For a seasonal storage plan, enter a rainfall estimate and roof area in the calculator. To practise reading a public Khmer bulletin aloud, use the audio maker and keep the original issue time with the recording.', 'សម្រាប់ផែនការស្តុកទឹកតាមរដូវ សូមបញ្ចូលបរិមាណភ្លៀងប៉ាន់ប្រមាណ និងផ្ទៃដំបូលក្នុងឧបករណ៍គណនា។ ដើម្បីហាត់អានសេចក្តីជូនដំណឹងសាធារណៈជាភាសាខ្មែរ សូមប្រើឧបករណ៍បង្កើតសំឡេង ហើយរក្សាពេលចេញផ្សាយដើមជាមួយសំឡេង។'),
      bi('Agree on one practical preparation and a time to check for an update with a person who can reach those without internet access.', 'ព្រមព្រៀងលើការត្រៀមមួយ និងពេលពិនិត្យព័ត៌មានថ្មី ជាមួយអ្នកដែលអាចជួយប្រាប់អ្នកគ្មានអ៊ីនធឺណិត។'),
    ],
    links: [
      { label: bi('MOWRAM Khmer provincial forecasts for Android', 'កម្មវិធីព្យាករណ៍អាកាសធាតុតាមខេត្តសម្រាប់ Android'), url: 'https://play.google.com/store/apps/details?id=com.cammob.weather.mowram' },
      { label: bi('Khmer One audio maker for a public Khmer bulletin', 'ឧបករណ៍បង្កើតសំឡេងសម្រាប់សេចក្តីជូនដំណឹងជាខ្មែរ'), url: '/teacher-audio' },
      { label: bi('National Flood Forecasting Centre', 'មជ្ឈមណ្ឌលជាតិព្យាករណ៍ទឹកជំនន់'), url: 'https://www.nffc.dhrw-cam.org/' },
      { label: bi('Mekong River Commission station forecasts', 'ការព្យាករណ៍តាមស្ថានីយរបស់គណៈកម្មការទន្លេមេគង្គ'), url: 'https://ffw.mrcmekong.org/overview.php' },
    ],
    prompts: [
      bi('Province, forecast source and issue time', 'ខេត្ត ប្រភពព្យាករណ៍ និងពេលចេញផ្សាយ'),
      bi('River station, time, units and trend', 'ស្ថានីយទន្លេ ពេលវាស់ ឯកតា និងនិន្នាការ'),
      bi('Action, person to inform and next update', 'សកម្មភាព អ្នកត្រូវជូនដំណឹង និងពេលតាមដានបន្ទាប់'),
    ],
  },
  {
    n: 11, slug: 'waste-repair-nature',
    ministry: bi('Environment', 'ក្រសួងបរិស្ថាន'),
    title: bi('Waste, Repair, and Nature Map', 'ផែនទីសេវាសំណល់ ការជួសជុល និងតំបន់ធម្មជាតិ'),
    benefit: bi('Checking what a collector accepts can spare a wasted journey. A repair programme can keep bicycles in service for school trips. A wetland map gives students a local example of habitat that clean-up work can protect.', 'ការសួរបញ្ជាក់ប្រភេទសំណល់ដែលគេទទួលអាចជួយកុំឱ្យខាតពេលធ្វើដំណើរ។ កម្មវិធីជួសជុលអាចជួយឱ្យសិស្សប្រើកង់ទៅសាលាបានយូរជាងមុន។ ផែនទីតំបន់ដីសើមជួយសិស្សស្គាល់ជម្រកសត្វនៅមូលដ្ឋាន ដែលការសម្អាតបរិស្ថានអាចជួយការពារបាន។'),
    steps: [
      bi('Contact the local collection operator with the material and approximate quantity. Confirm how it should be sorted, where collection is available and any charge.', 'សួរអ្នកប្រមូលសំណល់ក្នុងតំបន់ ដោយប្រាប់ប្រភេទ និងបរិមាណប្រហាក់ប្រហែល។ បញ្ជាក់របៀបបែងចែក តំបន់ដែលអាចប្រមូលបាន និងថ្លៃសេវា។'),
      bi('For a damaged bicycle, check local repair options. Read the Siem Reap refurbishment example and ask the programme what it can accept before bringing an item.', 'បើកង់ខូច សូមពិនិត្យជម្រើសជួសជុលនៅមូលដ្ឋាន។ អានអំពីគំរូកែច្នៃកង់ចាស់នៅសៀមរាប ហើយសួរកម្មវិធីថាទទួលអ្វីខ្លះ មុននឹងយករបស់ទៅ។'),
      bi('For a cleanup, agree on a collection point and pickup time with the operator before inviting volunteers. Report missed pickups through its service contact.', 'មុនអញ្ជើញអ្នកស្ម័គ្រចិត្តមកសម្អាត សូមព្រមព្រៀងជាមួយអ្នកប្រមូលសំណល់អំពីទីតាំង និងពេលប្រមូល។ បើគ្មានការប្រមូលតាមកំណត់ សូមទាក់ទងអ្នកផ្តល់សេវា។'),
      bi('Choose a wetland from the Ramsar map. Discuss where litter from the village might enter the water and ask local managers how to help protect the site.', 'ជ្រើសតំបន់ដីសើមមួយពីផែនទីរ៉ាមសារ។ ពិភាក្សាថាសំរាមពីភូមិអាចហូរចូលទឹកនៅទីណា ហើយសួរអ្នកគ្រប់គ្រងមូលដ្ឋានអំពីវិធីចូលរួមការពារ។'),
    ],
    links: [
      { label: bi('Trash is Nice, Phnom Penh · ask which plastic and drop-off point to use', 'Trash is Nice ភ្នំពេញ · សួរអំពីប្រភេទប្លាស្ទិកដែលទទួល និងទីតាំងសម្រាប់យកទៅដាក់'), url: 'https://trashisnice.wixsite.com/preciousplastic' },
      { label: bi('GAEA waste collection contacts and service areas', 'ទំនាក់ទំនង និងតំបន់សេវាប្រមូលសំណល់របស់ GAEA'), url: 'https://gaea.com.kh/contact/' },
      { label: bi('REACH Siem Reap bicycle repair programme', 'កម្មវិធីជួសជុលកង់ REACH នៅសៀមរាប'), url: 'https://reachsiemreap.org/reach-repair-shop/' },
      { label: bi('Cambodia wetland sites and coordinates (PDF)', 'តំបន់ដីសើមកម្ពុជា និងកូអរដោនេ (PDF)'), url: 'https://rsis.ramsar.org/sites/default/files/rsiswp_search/exports/Ramsar-Sites-annotated-summary-Cambodia.pdf' },
    ],
    prompts: [
      bi('Item to repair or material to collect', 'របស់ត្រូវជួសជុល ឬសម្ភារៈត្រូវប្រមូល'),
      bi('Provider, accepted items and date confirmed', 'អ្នកផ្តល់សេវា របស់ដែលទទួល និងថ្ងៃបញ្ជាក់'),
      bi('Nearby natural area and one way to protect it', 'តំបន់ធម្មជាតិក្បែរនោះ និងវិធីការពារមួយ'),
    ],
  },
  {
    n: 12, slug: 'household-energy',
    ministry: bi('Mines and Energy', 'ក្រសួងរ៉ែ និងថាមពល'),
    title: bi('Household Energy Toolkit', 'ឧបករណ៍គណនាថាមពលសម្រាប់គ្រួសារ'),
    benefit: bi('Estimating how much a fan or lamp uses helps a household compare possible savings before replacing equipment. A teacher can repeat the calculation with classroom lights to explain the school electricity bill.', 'ការប៉ាន់ប្រមាណអគ្គិសនីដែលកង្ហារ ឬអំពូលប្រើ ជួយគ្រួសារប្រៀបធៀបប្រាក់ដែលអាចសន្សំ មុនទិញឧបករណ៍ថ្មី។ គ្រូអាចប្រើវិធីដូចគ្នាចំពោះអំពូលក្នុងថ្នាក់ ដើម្បីពន្យល់វិក្កយបត្រអគ្គិសនីរបស់សាលា។'),
    steps: [
      bi('Read the appliance label for watts. Estimate hours of use on an ordinary day and the number of days used.', 'អានចំនួនវ៉ាត់លើស្លាកឧបករណ៍។ ប៉ាន់ប្រមាណចំនួនម៉ោងដែលប្រើក្នុងមួយថ្ងៃធម្មតា និងចំនួនថ្ងៃដែលប្រើ។'),
      bi('Multiply watts by hours per day and days of use, then divide by 1,000 for kilowatt-hours. A 50-watt fan used six hours daily for 30 days uses about 9 kWh.', 'គុណចំនួនវ៉ាត់នឹងចំនួនម៉ោងប្រើក្នុងមួយថ្ងៃ និងចំនួនថ្ងៃប្រើ រួចចែកនឹង ១ ០០០ ដើម្បីរកគីឡូវ៉ាត់ម៉ោង។ កង្ហារ ៥០ វ៉ាត់ ប្រើ ៦ ម៉ោងក្នុងមួយថ្ងៃ រយៈពេល ៣០ ថ្ងៃ ប្រើប្រហែល ៩ គីឡូវ៉ាត់ម៉ោង។'),
      bi('For rooftop solar, ask two qualified installers for written quotes covering panel capacity, expected output, batteries, installation, warranty and maintenance. Ask who performs electrical inspections before agreeing to work.', 'សម្រាប់ប្រព័ន្ធសូឡាលើដំបូល សុំសម្រង់តម្លៃជាលាយលក្ខណ៍អក្សរពីអ្នកដំឡើងមានជំនាញពីរនាក់ ដោយបញ្ជាក់កម្លាំងបន្ទះ បរិមាណថាមពលរំពឹងទុក អាគុយ ថ្លៃដំឡើង ការធានា និងការថែទាំ។ សួរអំពីអ្នកត្រួតពិនិត្យអគ្គិសនីមុនព្រមព្រៀង។'),
      bi('Use the price per kWh from your bill for an energy-cost estimate. Try fewer hours or a different appliance rating. Actual bills can include other charges and rates.', 'ប្រើតម្លៃក្នុងមួយគីឡូវ៉ាត់ម៉ោងពីវិក្កយបត្ររបស់អ្នក ដើម្បីប៉ាន់ប្រមាណថ្លៃថាមពល។ សាកកាត់បន្ថយម៉ោង ឬប្ដូរចំនួនវ៉ាត់។ វិក្កយបត្រជាក់ស្តែងអាចមានថ្លៃផ្សេងទៀត និងអត្រាផ្សេងៗ។'),
    ],
    links: [
      { label: bi('Ministry rooftop solar application guidance', 'ការណែនាំរបស់ក្រសួងសម្រាប់ដាក់ពាក្យដំឡើងសូឡាលើដំបូល'), url: 'https://mme.gov.kh/strategic-sectors/energy/permits-and-registrations/rooftop-solar-application' },
      { label: bi('Check energy professional registration requirements', 'ពិនិត្យលក្ខខណ្ឌចុះបញ្ជីអ្នកជំនាញថាមពល'), url: 'https://mme.gov.kh/strategic-sectors/energy/permits-and-registrations/energy-professional-registration' },
      { label: bi('Find clean energy businesses and verify credentials with their issuer', 'ស្វែងរកអាជីវកម្មថាមពលស្អាត រួចផ្ទៀងផ្ទាត់វិញ្ញាបនបត្រជាមួយស្ថាប័នចេញ'), url: 'https://cleanenergycambodia.org/cleanenergyorg' },
      { label: bi('Ministry energy efficiency policies and appliance standards', 'គោលនយោបាយប្រសិទ្ធភាពថាមពល និងស្តង់ដារឧបករណ៍'), url: 'https://mme.gov.kh/strategic-sectors/energy/recent-legislations-and-regulations' },
    ],
    prompts: [
      bi('Appliance and wattage on its label', 'ឧបករណ៍ និងចំនួនវ៉ាត់លើស្លាក'),
      bi('Typical daily hours and days of use', 'ចំនួនម៉ោងប្រើក្នុងមួយថ្ងៃ និងចំនួនថ្ងៃប្រើ'),
      bi('Estimated energy use and one change to compare', 'បរិមាណថាមពលប៉ាន់ប្រមាណ និងការផ្លាស់ប្ដូរមួយសម្រាប់ប្រៀបធៀប'),
    ],
  },
];
