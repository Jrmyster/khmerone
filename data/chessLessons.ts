import type { LocalizedText } from "../types/app";

export interface ChessExercise {
  id: string;
  title: LocalizedText;
  explanation: LocalizedText;
  goal: LocalizedText;
  hint: LocalizedText;
  fen: string;
  /** Coordinate moves, including the promotion suffix when applicable. */
  solution: string[];
}
const text = (en: string, km: string): LocalizedText => ({ en, km });

export const chessLessons: ChessExercise[] = [
  {
    id: "rook", title: text("01 · The rook", "០១ · រុក (Rook)"),
    explanation: text("A rook moves along a rank or file, as far as the path is clear. It cannot jump over pieces. Select the rook on a1 to see its legal moves.", "រុកដើរតាមជួរដេក ឬជួរឈរ បានច្រើនក្រឡាបើផ្លូវទំនេរ។ វាមិនអាចលោតរំលងកូនផ្សេងទេ។ ជ្រើសរុកនៅ a1 ដើម្បីមើលក្រឡាដែលអាចដើរបាន។"),
    goal: text("Move the rook from a1 to a7.", "ដើររុកពី a1 ទៅ a7។"),
    hint: text("Stay on the a-file. Select a1, then a7.", "ដើរតាមជួរឈរ a។ ជ្រើស a1 រួច a7។"),
    fen: "7k/8/8/8/8/8/4K3/R7 w - - 0 1", solution: ["a1a7"],
  },
  {
    id: "bishop", title: text("02 · The bishop", "០២ · ប៊ីស្សុប (Bishop)"),
    explanation: text("A bishop moves diagonally and stays on the same square color throughout the game. Like the rook, it cannot jump over another piece.", "ប៊ីស្សុបដើរតាមអង្កត់ទ្រូង ហើយនៅលើក្រឡាពណ៌ដដែលពេញការប្រកួត។ ដូចរុក វាមិនអាចលោតរំលងកូនផ្សេងបានទេ។"),
    goal: text("Move the bishop from c1 to g5.", "ដើរប៊ីស្សុបពី c1 ទៅ g5។"),
    hint: text("Follow c1 → d2 → e3 → f4 → g5.", "តាមអង្កត់ទ្រូង c1 → d2 → e3 → f4 → g5។"),
    fen: "7k/8/8/8/8/8/4K3/2B5 w - - 0 1", solution: ["c1g5"],
  },
  {
    id: "knight", title: text("03 · The knight", "០៣ · សេះ (Knight)"),
    explanation: text("A knight moves two squares in one direction and one at a right angle: an L. It can jump over other pieces. Its destination is always the opposite color.", "សេះដើរពីរក្រឡាតាមទិសមួយ រួចមួយក្រឡាកែង៖ រាងអក្សរ L។ វាអាចលោតរំលងកូនផ្សេង។ ក្រឡាគោលដៅតែងមានពណ៌ផ្ទុយ។"),
    goal: text("Jump the knight from b1 to c3.", "លោតសេះពី b1 ទៅ c3។"),
    hint: text("Two ranks forward and one file right.", "ទៅមុខពីរជួរ ហើយទៅស្ដាំមួយជួរឈរ។"),
    fen: "7k/8/8/8/8/8/PP2K3/1N6 w - - 0 1", solution: ["b1c3"],
  },
  {
    id: "queen", title: text("04 · The queen", "០៤ · មហេសី (Queen)"),
    explanation: text("The queen combines the rook's straight moves and the bishop's diagonals. She cannot jump over pieces. Watch how many squares she can reach.", "មហេសីអាចដើរត្រង់ដូចរុក និងអង្កត់ទ្រូងដូចប៊ីស្សុប។ វាមិនអាចលោតរំលងកូនផ្សេង។ មើលថាវាអាចទៅដល់ប៉ុន្មានក្រឡា។"),
    goal: text("Move the queen from d1 to d6.", "ដើរមហេសីពី d1 ទៅ d6។"),
    hint: text("Move straight up the d-file.", "ដើរត្រង់តាមជួរឈរ d។"),
    fen: "7k/8/8/8/8/8/4K3/3Q4 w - - 0 1", solution: ["d1d6"],
  },
  {
    id: "king", title: text("05 · The king", "០៥ · ស្ដេច (King)"),
    explanation: text("The king moves one square in any direction, but never onto an attacked square. Protecting your king is the aim of the game; kings are never captured.", "ស្ដេចដើរមួយក្រឡាតាមទិសណាក៏បាន ប៉ុន្តែមិនអាចចូលក្រឡាដែលគេគំរាម។ ការពារស្ដេចគឺជាគោលដៅនៃល្បែង។ មិនមានការចាប់ស្ដេចទេ។"),
    goal: text("Move the king from e2 to d3.", "ដើរស្ដេចពី e2 ទៅ d3។"),
    hint: text("One square diagonally forward and left.", "មួយក្រឡាអង្កត់ទ្រូងទៅមុខ និងឆ្វេង។"),
    fen: "7k/8/8/8/8/8/4K3/R7 w - - 0 1", solution: ["e2d3"],
  },
  {
    id: "pawn", title: text("06 · Pawns & captures", "០៦ · កូនអុក (Pawn) និងការចាប់"),
    explanation: text("Pawns move forward, but capture one square diagonally forward. From their starting rank they may move two squares if both are empty. White moves toward rank 8.", "កូនអុកដើរទៅមុខ ប៉ុន្តែចាប់មួយក្រឡាអង្កត់ទ្រូងទៅមុខ។ ពីជួរចាប់ផ្ដើម វាអាចដើរពីរក្រឡាបើទំនេរទាំងពីរ។ សដើរឆ្ពោះទៅជួរ 8។"),
    goal: text("Capture the black pawn on d5 with your pawn on e4.", "ប្រើកូនអុកសនៅ e4 ចាប់កូនអុកខ្មៅនៅ d5។"),
    hint: text("Select e4, then the occupied diagonal square d5.", "ជ្រើស e4 រួចក្រឡាអង្កត់ទ្រូង d5។"),
    fen: "7k/8/8/3p4/4P3/8/4K3/8 w - - 0 1", solution: ["e4d5"],
  },
  {
    id: "check", title: text("07 · Get out of check", "០៧ · គេចពីការគំរាមស្ដេច"),
    explanation: text("Check means your king is attacked. You must escape by moving the king, blocking the attack, or capturing the attacking piece. Other moves are not legal.", "ស្ដេចត្រូវគំរាម មានន័យថាគេកំពុងវាយស្ដេចរបស់អ្នក។ អ្នកត្រូវដើរស្ដេចគេច បាំងផ្លូវ ឬចាប់កូនដែលគំរាម។ ការដើរផ្សេងមិនស្របច្បាប់ទេ។"),
    goal: text("Block the rook's attack by moving your bishop from c1 to e3.", "បាំងការគំរាមរបស់រុក ដោយដើរប៊ីស្សុបពី c1 ទៅ e3។"),
    hint: text("The black rook attacks along the e-file. Put the bishop between it and your king.", "រុកខ្មៅគំរាមតាមជួរឈរ e។ ដាក់ប៊ីស្សុបនៅចន្លោះរុក និងស្ដេច។"),
    fen: "4r2k/8/8/8/8/8/8/2B1K3 w - - 0 1", solution: ["c1e3"],
  },
  {
    id: "castle", title: text("08 · Castling", "០៨ · ការប្ដូរទីតាំងស្ដេច និងរុក"),
    explanation: text("To castle kingside, move the king two squares toward the rook. The rook moves beside it. Neither may have moved; the path must be clear. Your king cannot castle out of, through, or into check.", "ដើម្បីប្ដូរទីតាំងខាងស្ដេច ដើរស្ដេចពីរក្រឡាទៅរករុក។ រុកផ្លាស់មកជាប់ស្ដេច។ ទាំងពីរមិនធ្លាប់ដើរ ផ្លូវទំនេរ ហើយស្ដេចមិនត្រូវគំរាម ឬឆ្លងក្រឡាដែលគេគំរាម។"),
    goal: text("Castle by selecting e1, then g1.", "ប្ដូរទីតាំងដោយជ្រើស e1 រួច g1។"),
    hint: text("The king goes e1 → g1; the rook automatically goes h1 → f1.", "ស្ដេចទៅពី e1 → g1 ហើយរុកទៅពី h1 → f1 ដោយស្វ័យប្រវត្តិ។"),
    fen: "4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1", solution: ["e1g1"],
  },
  {
    id: "promotion", title: text("09 · Promotion", "០៩ · ការឡើងឋានៈ"),
    explanation: text("A pawn reaching the farthest rank becomes a queen, rook, bishop, or knight of the same color. Choose the piece when the promotion menu opens.", "កូនអុកដែលទៅដល់ជួរចុងម្ខាងទៀត ត្រូវប្ដូរជាមហេសី រុក ប៊ីស្សុប ឬសេះពណ៌ដដែល។ ជ្រើសកូនពេលបញ្ជីឡើងឋានៈបង្ហាញ។"),
    goal: text("Move a7 to a8 and promote to a queen.", "ដើរពី a7 ទៅ a8 ហើយឡើងជាមហេសី។"),
    hint: text("Select a7, select a8, then choose Queen.", "ជ្រើស a7 ជ្រើស a8 រួចជ្រើសមហេសី។"),
    fen: "7k/P7/8/8/8/8/4K3/8 w - - 0 1", solution: ["a7a8q"],
  },
  {
    id: "en-passant", title: text("10 · En passant", "១០ · ការចាប់ពេលឆ្លងកាត់ (En passant)"),
    explanation: text("Immediately after an enemy pawn advances two squares beside your pawn, you may capture it as if it had moved one square. This special capture is available only on your very next move.", "ភ្លាមៗក្រោយកូនអុកគូប្រកួតដើរពីរក្រឡាមកជាប់កូនអុករបស់អ្នក អ្នកអាចចាប់ដូចជាវាបានដើរមួយក្រឡា។ ជម្រើសពិសេសនេះមានតែនៅការដើរបន្ទាប់ភ្លាមប៉ុណ្ណោះ។"),
    goal: text("The black pawn just moved d7 → d5. Capture it with e5 → d6.", "កូនអុកខ្មៅទើបដើរ d7 → d5។ ចាប់វាដោយដើរ e5 → d6។"),
    hint: text("Your pawn lands on d6; the black pawn on d5 is removed.", "កូនអុករបស់អ្នកទៅ d6 ហើយកូនអុកខ្មៅនៅ d5 ត្រូវដកចេញ។"),
    fen: "7k/8/8/3pP3/8/8/4K3/8 w - d6 0 2", solution: ["e5d6"],
  },
];

export const chessPuzzles: ChessExercise[] = [
  {
    id: "free-queen", title: text("01 · An undefended piece", "០១ · កូនគ្មានការការពារ"),
    explanation: text("Before moving, look for an opponent's piece you can capture safely. Here the queen is on the same file as your rook and has no defender.", "មុនដើរ ស្វែងរកកូនគូប្រកួតដែលអាចចាប់ដោយសុវត្ថិភាព។ មហេសីនៅជួរឈរដូចរុករបស់អ្នក ហើយគ្មានអ្នកការពារ។"),
    goal: text("Win the black queen with your rook.", "ប្រើរុកចាប់មហេសីខ្មៅ។"), hint: text("Look along the a-file: a1 → a7.", "មើលតាមជួរឈរ a៖ a1 → a7។"),
    fen: "7k/q7/8/8/8/8/4K3/R7 w - - 0 1", solution: ["a1a7"],
  },
  {
    id: "knight-fork", title: text("02 · The knight fork", "០២ · សេះគំរាមពីរគោលដៅ"),
    explanation: text("A fork attacks two pieces at once. Find a knight move that checks the king and attacks the rook at the same time.", "ការគំរាមពីរគោលដៅ គឺវាយកូនពីរក្នុងពេលតែមួយ។ រកការដើរសេះដែលគំរាមស្ដេច និងរុកក្នុងពេលតែមួយ។"),
    goal: text("Move your knight to c7, checking the king and attacking the rook.", "ដើរសេះទៅ c7 ដើម្បីគំរាមស្ដេច និងរុក។"), hint: text("From b5, the knight can jump to c7.", "ពី b5 សេះអាចលោតទៅ c7។"),
    fen: "r3k3/8/8/1N6/8/8/4K3/8 w - - 0 1", solution: ["b5c7"],
  },
  {
    id: "mate-one", title: text("03 · Checkmate in one", "០៣ · ឈ្នះដោយការដើរមួយ"),
    explanation: text("Checkmate means the king is in check with no legal escape. Your king protects g7. Use the queen to close off the black king's remaining squares.", "ឈ្នះដោយគំរាមស្ដេច មានន័យថាស្ដេចត្រូវគំរាម ហើយគ្មានការគេចស្របច្បាប់។ ស្ដេចសការពារ g7។ ប្រើមហេសីបិទក្រឡាគេចរបស់ស្ដេចខ្មៅ។"),
    goal: text("Deliver checkmate with Qg7#.", "ដើរមហេសីទៅ g7 ដើម្បីឈ្នះ (Qg7#)។"), hint: text("Move the queen from g6 to g7.", "ដើរមហេសីពី g6 ទៅ g7។"),
    fen: "7k/8/5KQ1/8/8/8/8/8 w - - 0 1", solution: ["g6g7"],
  },
  {
    id: "rook-mate", title: text("04 · The back-rank mate", "០៤ · ឈ្នះនៅជួរខាងក្រោយ"),
    explanation: text("A king can be trapped by its own pawns. A rook can check along the back rank while those pawns block the escape squares.", "ស្ដេចអាចជាប់ដោយកូនអុករបស់ខ្លួន។ រុកអាចគំរាមតាមជួរខាងក្រោយ ខណៈកូនអុកទាំងនោះបិទផ្លូវគេច។"),
    goal: text("Move your rook to e8 for checkmate.", "ដើររុកទៅ e8 ដើម្បីឈ្នះ។"), hint: text("The e-file is clear. Try e1 → e8.", "ជួរឈរ e ទំនេរ។ សាក e1 → e8។"),
    fen: "6k1/5ppp/8/8/8/8/8/K3R3 w - - 0 1", solution: ["e1e8"],
  },
];
