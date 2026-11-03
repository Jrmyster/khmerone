// Teaching-image provenance is separate from the BSD-licensed viewer.
// Descriptions and Khmer text are original educational drafts, not clinical findings.
const bi = (en, km) => ({en, km});
const author = 'Berkshire Community College Bioscience Image Library';
export const specimens = [
  {
    id:'muscle', name:bi('Skeletal muscle','សាច់ដុំជាប់ឆ្អឹង'), subtitle:bi('Long fibers & repeating bands','សរសៃវែង និងឆ្នូតដដែលៗ'),
    image:'assets/muscle.jpg', width:3072, height:1732,
    source:'https://commons.wikimedia.org/wiki/File:Skeletal_Muscle_Tissue.jpg', original:'https://upload.wikimedia.org/wikipedia/commons/8/89/Skeletal_Muscle_Tissue.jpg',
    sourceSha1:'1d4c32efcc9168fac8342f5be5da4f5b05041c71', author, license:'CC0-1.0', licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/', reportedMagnification:200,
    description:bi('This photograph shows long, roughly parallel skeletal muscle fibers. Look across a fiber for repeated light and dark bands. The purple elongated spots are stained nuclei.','រូបថតនេះបង្ហាញសរសៃសាច់ដុំជាប់ឆ្អឹងវែងៗ ដែលស្របគ្នាប្រហាក់ប្រហែល។ រកមើលឆ្នូតភ្លឺ និងងងឹតដដែលៗ។ ចំណុចពណ៌ស្វាយរាងវែងគឺស្នូលកោសិកាដែលបានដាក់ពណ៌។'),
    observations:[bi('Follow one pink fiber from the top to the bottom of the photograph.','តាមដានសរសៃពណ៌ផ្កាឈូកមួយពីលើចុះក្រោម។'),bi('Marker 1: inspect an elongated, dark-stained nucleus.','សញ្ញា១៖ ពិនិត្យស្នូលកោសិការាងវែងពណ៌ងងឹត។'),bi('Marker 2: compare the repeating bands across a muscle fiber.','សញ្ញា២៖ ប្រៀបធៀបឆ្នូតដដែលៗលើសរសៃសាច់ដុំ។')],
    markers:[{x:.342,y:.356,label:bi('Stained nucleus','ស្នូលកោសិកាដាក់ពណ៌')},{x:.1,y:.56,label:bi('Banded muscle fiber','សរសៃសាច់ដុំមានឆ្នូត')}],
    question:bi('Which pattern best describes this tissue?','លំនាំមួយណាពិពណ៌នាជាលិកានេះបានល្អបំផុត?'),
    choices:[bi('Long fibers with repeating bands','សរសៃវែងមានឆ្នូតដដែលៗ'),bi('Many separate round cells','កោសិកាមូលដាច់ៗជាច្រើន'),bi('Rings of cells around openings','កោសិកាជុំវិញប្រហោង')],answer:0,
    explanation:bi('The long, banded fibers are the key observation. The bands are easier to compare after zooming into a single fiber.','សរសៃវែងមានឆ្នូតគឺជាលក្ខណៈសំខាន់ដែលអាចសង្កេតបាន។ ពង្រីកសរសៃមួយដើម្បីប្រៀបធៀបឆ្នូត។')
  },
  {
    id:'blood',name:bi('Human blood','ឈាមមនុស្ស'),subtitle:bi('A field of separate cells','កោសិកាដាច់ៗក្នុងផ្ទៃរូបភាព'),image:'assets/blood.jpg',width:3264,height:1840,
    source:'https://commons.wikimedia.org/wiki/File:Connective_Tissue_Human_Blood_(39982278130).jpg',original:'https://upload.wikimedia.org/wikipedia/commons/c/c1/Connective_Tissue_Human_Blood_%2839982278130%29.jpg',sourceSha1:'adc125fd08de9782561e0d42976572d3846b6724',author,license:'CC0-1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',reportedMagnification:100,
    description:bi('A prepared smear spreads blood cells across a slide. Compare this field of small, separate cells with the long fibers in the muscle photograph. Do not infer a person’s health from this teaching image.','បន្ទះសំណាកនេះបង្ហាញកោសិកាឈាមដែលត្រូវបានលាបលើកញ្ចក់។ ប្រៀបធៀបកោសិកាតូចៗដាច់ៗនឹងសរសៃវែងក្នុងរូបថតសាច់ដុំ។ កុំសន្និដ្ឋានអំពីសុខភាពមនុស្សពីរូបភាពសិក្សានេះ។'),
    observations:[bi('Start with the whole field before zooming into a small area.','ចាប់ផ្ដើមមើលផ្ទៃទាំងមូល មុនពង្រីកតំបន់តូចមួយ។'),bi('Compare cell outlines and the spaces between them.','ប្រៀបធៀបរាងគែមកោសិកា និងចន្លោះរវាងវា។'),bi('Record what you see; color alone cannot establish a diagnosis.','កត់ត្រាអ្វីដែលអ្នកឃើញ។ ពណ៌តែមួយមិនអាចកំណត់រោគវិនិច្ឆ័យបានទេ។')],markers:[],
    question:bi('Which is an observation rather than a diagnosis?','មួយណាជាការសង្កេត មិនមែនជារោគវិនិច្ឆ័យ?'),choices:[bi('The person definitely has an infection.','មនុស្សនេះប្រាកដជាមានការឆ្លងមេរោគ។'),bi('Many small cells are spread across the image.','កោសិកាតូចៗជាច្រើនរាយប៉ាយក្នុងរូបភាព។'),bi('The person needs a particular medicine.','មនុស្សនេះត្រូវការថ្នាំជាក់លាក់មួយ។')],answer:1,
    explanation:bi('An observation describes visible features. This image alone does not establish illness or a need for treatment.','ការសង្កេតពិពណ៌នាលក្ខណៈដែលអាចមើលឃើញ។ រូបភាពនេះតែមួយមិនអាចកំណត់ជំងឺ ឬតម្រូវការព្យាបាលបានទេ។')
  },
  {
    id:'kidney',name:bi('Kidney tubules','បំពង់តូចៗក្នុងតម្រងនោម'),subtitle:bi('Cells arranged around spaces','កោសិការៀបជុំវិញប្រហោង'),image:'assets/kidney.jpg',width:3264,height:1840,
    source:'https://commons.wikimedia.org/wiki/File:Epithelial_Tissues_Simple_Cuboidal_Epithelium_(41681552782).jpg',original:'https://upload.wikimedia.org/wikipedia/commons/9/9e/Epithelial_Tissues_Simple_Cuboidal_Epithelium_%2841681552782%29.jpg',author,license:'CC0-1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',reportedMagnification:400,
    description:bi('This teaching section shows kidney tubules lined by simple cuboidal epithelium. In a cross-section, a tubule can appear as a ring of cells surrounding an opening called a lumen. The photograph does not show an entire kidney.','សំណាកសិក្សានេះបង្ហាញបំពង់តូចៗក្នុងតម្រងនោម ដែលមានស្រទាប់កោសិការាងគូប។ នៅផ្នែកកាត់ បំពង់អាចមានរាងដូចរង្វង់កោសិកាជុំវិញប្រហោងហៅថា lumen។ រូបថតនេះមិនបង្ហាញតម្រងនោមទាំងមូលទេ។'),
    observations:[bi('Look for repeated openings surrounded by tissue.','រកមើលប្រហោងជាច្រើនដែលមានជាលិកាជុំវិញ។'),bi('Compare the shape of two openings; a section can cut tubes at different angles.','ប្រៀបធៀបរាងប្រហោងពីរ។ ការកាត់អាចកាត់បំពង់តាមមុំខុសគ្នា។'),bi('Compare this organized tissue with the separate cells in the blood smear.','ប្រៀបធៀបជាលិកាដែលរៀបជារចនាសម្ព័ន្ធនេះនឹងកោសិកាដាច់ៗក្នុងសំណាកឈាម។')],markers:[],
    question:bi('What is the space inside a tubule called?','តើប្រហោងខាងក្នុងបំពង់តូចហៅថាអ្វី?'),choices:[bi('A muscle band','ឆ្នូតសាច់ដុំ'),bi('A microscope objective','កែវអុបទិកមីក្រូទស្សន៍'),bi('A lumen','Lumen (ប្រហោងខាងក្នុង)')],answer:2,
    explanation:bi('The lumen is the internal space of a tube. It is a structural term, not a sign of disease.','Lumen គឺជាប្រហោងខាងក្នុងបំពង់។ វាជាពាក្យសម្គាល់រចនាសម្ព័ន្ធ មិនមែនជាសញ្ញាជំងឺទេ។')
  }
];
export function selectSpecimen(id){return specimens.find(s=>s.id===id)||specimens[0];}
export function readNotes(raw){try{const parsed=JSON.parse(raw||'{}');return Object.fromEntries(specimens.map(s=>[s.id,typeof parsed?.[s.id]==='string'?parsed[s.id].slice(0,1000):'']));}catch{return Object.fromEntries(specimens.map(s=>[s.id,'']));}}
export function gradeAnswer(specimen,index){return Number.isInteger(index)&&index>=0&&index<specimen.choices.length&&index===specimen.answer;}
