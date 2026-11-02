import { AppCategory, type AppEntry } from '@/types/app';
export const brainScanApp: AppEntry = {
  id: 'brain-scan-explorer',
  title: {en:'Brain Scan Explorer',km:'ស្វែងយល់រូបភាពស្កេនខួរក្បាល'},
  category: AppCategory.Stem,
  categoryLabel: {en:'Medical & life sciences',km:'វិទ្យាសាស្ត្រវេជ្ជសាស្ត្រ និងជីវិត'},
  tagline: {en:'Explore a reference MRI from three directions.',km:'ស្វែងយល់រូបភាព MRI យោងតាមទិសបី។'},
  description: {en:'Explore axial, coronal and sagittal slices of an averaged MNI152 reference MRI, plus a 3D overview with NiiVue. Move linked slice controls, adjust display contrast, answer bilingual questions and keep private browser-local observations. Save the separate offline pack before disconnecting.',km:'ស្វែងយល់រូបភាពកាត់ MRI យោង MNI152 តាមទិសបី និងទិដ្ឋភាព 3D ដោយ NiiVue។ ផ្លាស់ទីរបារកាត់ កែភាពផ្ទុយពណ៌ ឆ្លើយសំណួរពីរភាសា និងកត់ត្រាលើកម្មវិធីរុករក។ រក្សាទុកកញ្ចប់ក្រៅបណ្ដាញជាមុន។'},
  audience: {en:'Secondary students, teachers & biology learners',km:'សិស្សមធ្យមសិក្សា គ្រូ និងអ្នកសិក្សាជីវវិទ្យា'},
  grades: ['lower-secondary','high-school','vocational-adult'],hasBilingualToggle:true,
  features: [{en:'Linked slices and 3D overview',km:'រូបភាពកាត់ភ្ជាប់គ្នា និងទិដ្ឋភាព 3D'},{en:'Khmer/English lessons and questions',km:'មេរៀន និងសំណួរខ្មែរ/អង់គ្លេស'},{en:'Optional offline reference pack',km:'កញ្ចប់យោងសម្រាប់ប្រើក្រៅបណ្ដាញ'}],
  tags:['brain','MRI','NiiVue','MNI152','anatomy','neuroscience','axial','coronal','sagittal','medical science','offline','ខួរក្បាល','កាយវិភាគ'],
  icon:'lab',url:'/brain-scan-explorer/index.html',offlineReady:false,
  notice:{en:'Reference teaching data only—not a patient record or diagnosis. WebGL2 is needed. Save the separate pack for offline use. Khmer translations await teacher review.',km:'ទិន្នន័យយោងសម្រាប់សិក្សា មិនមែនកំណត់ត្រាអ្នកជំងឺ ឬរោគវិនិច្ឆ័យទេ។ ត្រូវការ WebGL2។ រក្សាទុកកញ្ចប់ដោយឡែកសម្រាប់ប្រើក្រៅបណ្ដាញ។ ខ្មែរមិនទាន់បានពិនិត្យដោយគ្រូ។'},
};
