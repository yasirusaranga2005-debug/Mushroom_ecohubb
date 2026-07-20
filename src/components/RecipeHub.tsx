import React, { useState } from 'react';
import { Search, Clock, Award, BookOpen, Check, ThumbsUp, Heart } from 'lucide-react';

interface Recipe {
  id: string;
  nameEN: string;
  nameSI: string;
  category: 'Oyster' | 'Button' | 'Milky' | 'Abalone';
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Chef Level';
  descriptionEN: string;
  descriptionSI: string;
  image: string;
  ingredientsEN: string[];
  ingredientsSI: string[];
  stepsEN: string[];
  stepsSI: string[];
}

const RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    nameEN: 'Sri Lankan Spicy Devilled Mushrooms',
    nameSI: 'සිංහල ක්‍රමයට ඩෙවිල් හතු',
    category: 'Oyster',
    prepTime: '15 mins',
    cookTime: '15 mins',
    servings: 4,
    difficulty: 'Easy',
    descriptionEN: 'A classic, fiery Sri Lankan stir-fry packed with spices, peppers, and red onions. Texture-wise, this crispy oyster mushroom dish serves as a perfect substitute for devilled meat.',
    descriptionSI: 'ශ්‍රී ලාංකීය කුළුබඩු, මාළු මිරිස් සහ රතු ලූණු එක්කර සකසන ලද සැර ඩෙවිල් හතු බැදුමකි. මෙහි ඇති කටුක වයනය මස් වෙනුවට කදිම ආදේශකයකි.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600',
    ingredientsEN: [
      '250g Fresh Oyster Mushrooms (shredded)',
      '2 tbsp Cornflour (for dusting)',
      '1 large Onion (cut into chunks)',
      '2 Banana Peppers (Malu Miris, sliced)',
      '2 Tomatoes (cut into wedges)',
      '1 tbsp Ginger-Garlic paste',
      '2 tbsp Chili Flakes',
      '1 tbsp Tomato Sauce',
      '1 tbsp Soy Sauce',
      'Coconut Oil for deep frying'
    ],
    ingredientsSI: [
      'නැවුම් පිපිණි හතු ග්‍රෑම් 250 (කැබලිවලට කඩාගත්)',
      'කෝන්ෆ්ලවර් මේස හැඳි 2',
      'විශාල ලූණු ගෙඩි 1 (ලොකුවට කපාගත්)',
      'මාළු මිරිස් කරල් 2 (කපාගත්)',
      'තක්කාලි ගෙඩි 2 (කැබලිවලට කපාගත්)',
      'ඉඟුරු-සුදුලූණු පේස්ට් මේස හැඳි 1',
      'කෑලි මිරිස් මේස හැඳි 2',
      'තක්කාලි සෝස් මේස හැඳි 1',
      'සෝයා සෝස් මේස හැඳි 1',
      'බැදීම සඳහා පොල්තෙල්'
    ],
    stepsEN: [
      'Clean and dry the oyster mushrooms thoroughly, then coat them lightly in cornflour.',
      'Heat oil and deep fry the dusted mushrooms until light golden and crispy. Drain and set aside.',
      'In a separate wok, heat 1 tbsp of oil. Add ginger-garlic paste and stir-fry for 30 seconds.',
      'Add onion chunks and banana peppers, cooking for 2 minutes to keep them crunchy.',
      'Add chili flakes, tomato sauce, soy sauce, and salt to taste. Mix well to form a thick sauce.',
      'Toss in the crispy fried mushrooms and tomato wedges. Stir-fry on high heat for 1 minute so the sauce coats the mushrooms without making them soggy.',
      'Serve hot immediately!'
    ],
    stepsSI: [
      'හතු හොඳින් සෝදා වියළාගෙන, කෝන්ෆ්ලවර් තවරා ගන්න.',
      'තෙල් රත්කර හතු රන්වන් පැහැ වන තුරු බැද තෙල් බේරෙන්න හරින්න.',
      'වෙනත් භාජනයකට තෙල් මේස හැඳි 1ක් දමා රත්කර, ඉඟුරු-සුදුලූණු එක්කර තත්පර 30ක් තෙම්පරාදු කරන්න.',
      'ලූණු සහ මාළු මිරිස් එකතු කර විනාඩි 2ක් පමණ පිසගන්න.',
      'කෑලි මිරිස්, තක්කාලි සෝස්, සෝයා සෝස් සහ ලුණු එකතු කර හොඳින් මිශ්‍ර කරන්න.',
      'බැදගත් හතු සහ තක්කාලි කැබලි එකතු කර අධික ගින්දරේ විනාඩියක් හොඳින් කවලම් කර ලිපෙන් බාගන්න.',
      'උණුවෙන්ම පිළිගන්වන්න!'
    ]
  },
  {
    id: 'rec-2',
    nameEN: 'Creamy Button Mushroom Korma',
    nameSI: 'බටන් හතු ක්‍රීම් කෝර්මා',
    category: 'Button',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: 3,
    difficulty: 'Medium',
    descriptionEN: 'A rich, cashew-nut-based creamy curry. The firm texture of button mushrooms absorbs the cardamom and cinnamon-infused gravy, mimicking a premium chicken korma.',
    descriptionSI: 'කජු සහ පොල් කිරි මුසු කර සකසන ලද සාරවත් කෝර්මා ව්‍යංජනයකි. කරඳමුංගු සහ කුරුඳු සුවඳැති හොද්ද බටන් හතු වලට හොඳින් උරාගෙන අපූර්ව රසයක් ගෙනදෙයි.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    ingredientsEN: [
      '200g Button Mushrooms (halved)',
      '10 Cashew Nuts (soaked in warm water)',
      '1 Onion (finely chopped)',
      '1/2 cup Thick Coconut Milk',
      '1 tsp Garam Masala',
      '1/2 tsp Turmeric Powder',
      '2 Cardamoms & 1 Cinnamon stick',
      '1 tbsp Ghee or Butter',
      'Fresh Coriander leaves for garnish'
    ],
    ingredientsSI: [
      'බටන් හතු ග්‍රෑම් 200 (දෙකට කපාගත්)',
      'කජු මද 10 (උණු වතුරේ පොඟවා අඹරාගත්)',
      'හීනියට කපාගත් ලූණු ගෙඩි 1',
      'උකු පොල් කිරි කෝප්ප 1/2',
      'ගරම් මසාලා තේ හැඳි 1',
      'කහ කුඩු තේ හැඳි 1/2',
      'කරඳමුංගු 2 ක් සහ කුරුඳු පොතු කැබැල්ලක්',
      'එළඟිතෙල් හෝ බටර් මේස හැඳි 1',
      'සරසා ගැනීමට කොත්තමල්ලි කොළ'
    ],
    stepsEN: [
      'Blend the soaked cashew nuts into a smooth, thick paste. Set aside.',
      'Melt ghee in a pan. Add cardamom and cinnamon, sautéing until fragrant.',
      'Add onions and sauté until translucent and light brown.',
      'Toss in button mushrooms, turmeric powder, and garam masala. Cook for 5 minutes until mushrooms release their water and soften slightly.',
      'Pour in the cashew paste and cook on low heat for 3 minutes.',
      'Pour in thick coconut milk, season with salt, and simmer for 5 minutes until the curry reaches a rich, thick gravy consistency.',
      'Garnish with fresh coriander leaves and serve alongside warm roti or basmati rice.'
    ],
    stepsSI: [
      'පොඟවා ගත් කජු මද ටික හොඳින් අඹරා පේස්ට් එකක් සාදා ගන්න.',
      'භාජනයක එළඟිතෙල් රත්කර කරඳමුංගු සහ කුරුඳු එකතු කර සුවඳ එනතෙක් බැදගන්න.',
      'ලූණු එකතු කර රන්වන් පැහැ වනතුරු තෙම්පරාදු කරන්න.',
      'හතු, කහ කුඩු සහ ගරම් මසාලා එකතු කර විනාඩි 5ක් පමණ පිසගන්න.',
      'අඹරාගත් කජු පේස්ට් එක එකතු කර මද ගින්නේ විනාඩි 3ක් පිසගන්න.',
      'උකු පොල් කිරි සහ ලුණු එකතු කර හොද්ද උකු වන තෙක් විනාඩි 5ක් පමණ නටවා ගන්න.',
      'කොත්තමල්ලි කොළ ඉස රොටී හෝ බත් සමඟ පිළිගන්වන්න.'
    ]
  },
  {
    id: 'rec-3',
    nameEN: 'Crispy Southern-Fried Oyster Mushrooms',
    nameSI: 'දකුණු දිග ක්‍රමයට බැදපු කටුක හතු',
    category: 'Oyster',
    prepTime: '20 mins',
    cookTime: '15 mins',
    servings: 4,
    difficulty: 'Chef Level',
    descriptionEN: 'Golden, extra-crunchy oyster mushroom clusters battered in a buttermilk substitute and seasoned flour. It tastes exactly like southern fried chicken but is 100% plant-based.',
    descriptionSI: 'ඇමරිකානු දකුණු දිග ක්‍රමයට පිටි සහ කුළුබඩු තවරා බැදගත් හැපෙනසුළු හතු වට්ටෝරුවකි. මෙය බැදපු කුකුල් මස් වලට හාත්පසින්ම සමාන රසයක් ලබා දෙයි.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600',
    ingredientsEN: [
      '300g Oyster Mushrooms (separated into medium clusters)',
      '1 cup All-Purpose Flour',
      '1/4 cup Cornstarch',
      '1 cup Soy Milk + 1 tbsp Apple cider vinegar (to make vegan buttermilk)',
      '1 tsp Garlic Powder & Onion Powder',
      '1 tsp Smoked Paprika',
      '1/2 tsp Cayenne Pepper (optional for heat)',
      'Salt and Black Pepper to taste',
      'Vegetable Oil for frying'
    ],
    ingredientsSI: [
      'පිපිණි හතු ග්‍රෑම් 300 (මධ්‍යම ප්‍රමාණයේ පොකුරු)',
      'පාන් පිටි කෝප්ප 1',
      'කෝන්ස්ටාච් කෝප්ප 1/4',
      'සෝයා කිරි කෝප්ප 1 + විනාකිරි මේස හැඳි 1 (බටර්මිල්ක් සාදා ගැනීමට)',
      'සුදුලූණු කුඩු සහ ලූණු කුඩු තේ හැඳි 1 බැගින්',
      'පැප්රිකා කුඩු තේ හැඳි 1',
      'කඩල පිටි මේස හැඳි 2',
      'ලුණු සහ ගම්මිරිස් කුඩු රස අනුව',
      'බැදීමට තෙල්'
    ],
    stepsEN: [
      'Mix soy milk and apple cider vinegar, letting it sit for 5 minutes to curdle into vegan buttermilk.',
      'In a wide bowl, whisk together the flour, cornstarch, garlic powder, onion powder, paprika, cayenne, salt, and pepper.',
      'Dip an oyster mushroom cluster into the buttermilk, letting excess drip off, then dredge it thoroughly in the dry flour mix, pressing to ensure coating gets into the gills.',
      'Double coat by dipping it back in the buttermilk, then once more in the flour mix. Repeat for all clusters.',
      'Heat vegetable oil to 350°F (175°C) in a deep pan.',
      'Fry clusters in batches for 4-5 minutes, turning occasionally, until crispy and golden brown. Drain on a wire rack.',
      'Season with a pinch of salt while hot and serve with spicy dipping sauce.'
    ],
    stepsSI: [
      'සෝයා කිරි සහ විනාකිරි එකට මිශ්‍ර කර විනාඩි 5ක් තබන්න.',
      'ලොකු බෝල් එකක පාන් පිටි, කෝන්ස්ටාච්, සුදුලූණු කුඩු, ලූණු කුඩු, පැප්රිකා, ලුණු සහ ගම්මිරිස් එකට මිශ්‍ර කරන්න.',
      'හතු පොකුර බැගින් ගෙන මුලින්ම කිරි මිශ්‍රණයේ ගිල්වා, පසුව පිටි මිශ්‍රණයේ තවරන්න.',
      'කටුක බව වැඩි කර ගැනීමට නැවතත් කිරි මිශ්‍රණයේ ගිල්වා දෙවන වරටත් පිටි තවරන්න.',
      'ගැඹුරු තෙලේ රන්වන් පැහැ වන තුරු විනාඩි 4-5ක් පමණ බැදගන්න.',
      'තෙල් බේරෙන්න හැර සෝස් සමඟ පිළිගන්වන්න.'
    ]
  }
];

export default function RecipeHub({ language }: { language: 'EN' | 'SI' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const toggleIngredient = (ing: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ing]: !prev[ing]
    }));
  };

  const filteredRecipes = RECIPES.filter((recipe) => {
    const matchesSearch =
      recipe.nameEN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.nameSI.includes(searchTerm) ||
      recipe.descriptionEN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.descriptionSI.includes(searchTerm);

    const matchesCategory = activeCategory === 'All' || recipe.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" id="recipe-hub-root">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-black text-[#2D2D2A] tracking-tight">
          {language === 'EN' ? 'Co-operative Culinary Hub' : 'සමූපකාර ප්‍රණීත වට්ටෝරු'}
        </h1>
        <p className="text-[#8B4513] font-serif italic text-base md:text-lg max-w-2xl mx-auto">
          {language === 'EN'
            ? '"Taste like meat, zero meat" — Discover delicious, texturally satisfying plant-based recipes crafted using fresh local mushrooms.'
            : '"මස් වැනි රසැති, මස් රහිත" — දේශීය නැවුම් හතු යොදාගෙන සකසන ලද ගුණදායී ආහාර වට්ටෝරු සොයාගන්න.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Filter & Recipe List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Controls */}
          <div className="bg-white border border-[#5A5A40]/10 rounded-3xl p-5 shadow-xs space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder={language === 'EN' ? 'Search recipes...' : 'වට්ටෝරු සොයන්න...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-[#5A5A40]/25 rounded-2xl text-sm outline-none focus:border-[#8B4513] bg-stone-50/50"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Oyster', 'Button', 'Milky'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition ${
                    activeCategory === cat
                      ? 'bg-[#8B4513] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200/60 text-stone-600'
                  }`}
                >
                  {cat === 'All'
                    ? (language === 'EN' ? 'All Varieties' : 'සියල්ල')
                    : cat + ' Mushroom'}
                </button>
              ))}
            </div>
          </div>

          {/* Recipe Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredRecipes.length === 0 ? (
              <div className="col-span-2 py-16 text-center text-stone-400 font-serif italic text-sm bg-white rounded-3xl border border-dashed border-stone-200">
                {language === 'EN' ? 'No matching recipes found.' : 'වට්ටෝරු කිසිවක් හමු නොවීය.'}
              </div>
            ) : (
              filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    setCheckedIngredients({});
                  }}
                  className={`bg-white border cursor-pointer rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between ${
                    selectedRecipe?.id === recipe.id ? 'border-[#8B4513] ring-1 ring-[#8B4513]' : 'border-[#5A5A40]/10'
                  }`}
                >
                  <div>
                    {/* Card Image */}
                    <div className="h-44 w-full overflow-hidden relative bg-stone-100">
                      <img
                        src={recipe.image}
                        alt={recipe.nameEN}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-[#386641] text-[#F5F5F0] px-2.5 py-1 rounded-lg font-serif text-[10px] font-black uppercase tracking-wider">
                        {recipe.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-serif font-black text-stone-900 leading-snug group-hover:text-[#8B4513] transition">
                        {language === 'EN' ? recipe.nameEN : recipe.nameSI}
                      </h3>
                      <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed">
                        {language === 'EN' ? recipe.descriptionEN : recipe.descriptionSI}
                      </p>
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="px-5 py-3 border-t border-stone-50 bg-stone-50/50 flex justify-between text-[11px] text-stone-600 font-serif font-bold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#8B4513]" />
                      {recipe.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-[#386641]" />
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recipe Details Panel (5 cols) */}
        <div className="lg:col-span-5">
          {selectedRecipe ? (
            <div className="bg-white border border-[#5A5A40]/10 rounded-[32px] p-6 shadow-sm space-y-6 sticky top-20">
              <div className="space-y-4">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.nameEN}
                  className="w-full h-48 object-cover rounded-2xl shadow-xs"
                />
                <div className="space-y-1.5">
                  <span className="text-[10px] font-serif font-black text-[#386641] uppercase tracking-widest">
                    {selectedRecipe.category} Mushroom Recipe
                  </span>
                  <h2 className="text-2xl font-serif font-black text-stone-900 leading-tight">
                    {language === 'EN' ? selectedRecipe.nameEN : selectedRecipe.nameSI}
                  </h2>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-stone-100 text-center font-serif text-[11px] text-stone-700">
                <div className="space-y-0.5">
                  <span className="block text-stone-400 text-[10px] uppercase font-bold tracking-wider">Prep Time</span>
                  <span className="font-bold text-stone-800">{selectedRecipe.prepTime}</span>
                </div>
                <div className="space-y-0.5 border-x border-stone-100">
                  <span className="block text-stone-400 text-[10px] uppercase font-bold tracking-wider">Cook Time</span>
                  <span className="font-bold text-stone-800">{selectedRecipe.cookTime}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-stone-400 text-[10px] uppercase font-bold tracking-wider">Servings</span>
                  <span className="font-bold text-stone-800">{selectedRecipe.servings} Pax</span>
                </div>
              </div>

              {/* Ingredients Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-serif font-black uppercase text-stone-800 tracking-wider">
                  {language === 'EN' ? 'Ingredients Check-list' : 'අවශ්‍ය ද්‍රව්‍ය පිරික්සුම'}
                </h4>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {(language === 'EN' ? selectedRecipe.ingredientsEN : selectedRecipe.ingredientsSI).map((ing) => (
                    <label
                      key={ing}
                      onClick={() => toggleIngredient(ing)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition ${
                        checkedIngredients[ing]
                          ? 'border-[#386641]/25 bg-emerald-50/30 text-stone-400 line-through'
                          : 'border-stone-100 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center shrink-0 transition ${
                        checkedIngredients[ing]
                          ? 'bg-[#386641] border-[#386641] text-white'
                          : 'border-stone-300 bg-white'
                      }`}>
                        {checkedIngredients[ing] && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-[11.5px] leading-tight font-sans font-medium">{ing}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preparation Steps */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-serif font-black uppercase text-stone-800 tracking-wider">
                  {language === 'EN' ? 'Cooking Instructions' : 'සකස් කරන ආකාරය'}
                </h4>
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                  {(language === 'EN' ? selectedRecipe.stepsEN : selectedRecipe.stepsSI).map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                      <span className="h-5 w-5 rounded-full bg-[#8B4513]/10 text-[#8B4513] flex items-center justify-center shrink-0 font-serif font-bold text-[10px] mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-stone-600 font-sans">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full border border-dashed border-stone-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-3 text-stone-400 bg-[#F5F5F0]/30 min-h-[350px]">
              <Award className="h-10 w-10 text-stone-300" />
              <p className="font-serif italic text-sm max-w-[200px] leading-relaxed">
                {language === 'EN'
                  ? 'Select a recipe card on the left to display its full cooking instructions!'
                  : 'වම්පස ඇති ආහාර වට්ටෝරුවක් තෝරා එහි සවිස්තරාත්මක උපදෙස් මෙහි නරඹන්න!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
