import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Cpu, 
  Package, 
  Layers, 
  Info, 
  CheckCircle2, 
  Send, 
  Wrench, 
  ShieldCheck, 
  Search, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  DollarSign,
  MapPin,
  X,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { dataService } from '../lib/dataService';
import { UserRole, MachineItem } from '../types';

interface MachineryProps {
  language: 'EN' | 'SI';
  currentUserEmail?: string;
  currentUserId?: string;
  currentUserRole?: UserRole;
}



const CATEGORY_INFO = {
  powders: {
    titleEN: 'Category 1: Powders, Extracts & Supplements',
    titleSI: 'කාණ්ඩය 1: හතු කුඩු, සාරය සහ අතිරේක ආහාර',
    descEN: 'Complete processing line blueprints for manufacturing high-value functional supplements (like Lion’s Mane or Reishi capsules) or culinary seasoning powders.',
    descSI: 'සිංහ කේශර (Lion’s Mane) හෝ රෙයිෂි (Reishi) වැනි හතු වර්ග ආශ්‍රිත ඖෂධීය හෝ සුප් කුඩු සහ අතිරේක නිෂ්පාදන සඳහා වන පූර්ණ යන්ත්‍රෝපකරණ.',
    icon: Sparkles
  },
  culinary: {
    titleEN: 'Category 2: Culinary Canned, Jarred & Sliced',
    titleSI: 'කාණ්ඩය 2: කල්තබා ගන්නා ටින් සහ බෝතල් කළ හතු',
    descEN: 'Industrial-grade automated lines to wash, root-clip, slice, blanch, brine, and retort culinary mushrooms for retail grocery chains and food services.',
    descSI: 'සුපිරි වෙළඳසැල් සහ අවන්හල් සඳහා කල්තබා ගත හැකි පරිදි සකසන ලද, පෙති කපන ලද, තම්බන ලද හෝ ටින් කරන ලද හතු නිෂ්පාදන පෙළක් සඳහා වන යන්ත්‍ර.',
    icon: Layers
  },
  snacks: {
    titleEN: 'Category 3: Crispy Mushroom Snacks (Chips / Jerky)',
    titleSI: 'කාණ්ඩය 3: හැපෙනසුළු හතු ස්නැක්ස් (චිප්ස් සහ ජර්කි)',
    descEN: 'High-end vacuum-frying (VF) technology and flavoring lines to create low-fat, highly nutritious crispy Shiitake chips or tender mushroom jerky.',
    descSI: 'නූතන රික්ත බැදීමේ (Vacuum-Frying) තාක්ෂණය මඟින් තෙල් රහිත, පෝෂණ ගුණයෙන් ඉහළ හැපෙනසුළු ශයිටාකි චිප්ස් හෝ හතු වියළි මස් (Jerky) නිෂ්පාදනය සඳහා.',
    icon: Cpu
  }
};

const MACHINERY_DATA: Record<'powders' | 'culinary' | 'snacks', MachineItem[]> = {
  powders: [
    {
      id: 'mac-pow-1',
      nameEN: 'Commercial Air Washer / Bubble Washing Machine',
      nameSI: 'වාණිජ වායු සහ බුබුලු සේදුම් යන්ත්‍රය',
      descriptionEN: 'Cleans fresh whole mushrooms thoroughly to remove residual substrate dust, peat moss, and organic particles before dehydrating.',
      descriptionSI: 'හතු වියළීමට පෙර ඒවායේ ඇති උපස්තර දූවිලි සහ අනෙකුත් අපද්‍රව්‍ය පීඩන බුබුලු මඟින් සම්පූර්ණයෙන්ම පිරිසිදු කරන සේදුම් යන්ත්‍රය.',
      featuresEN: [
        'High-pressure water bubbling simulates manual washing to protect delicate mushroom caps.',
        'Continuous conveyor belt for streamlined automatic discharging.',
        'Water recycling filtration system to minimize eco-footprint.'
      ],
      featuresSI: [
        'හතු තොප්පියට හානි නොවන සේ පීඩන ජල බුබුලු මඟින් පිරිසිදු කිරීම.',
        'ස්වයංක්‍රීයව සෝදා ඉවත් කිරීම සඳහා අඛණ්ඩ වාහක පටිය (Conveyor belt).',
        'ජල පරිභෝජනය අවම කරන ප්‍රතිචක්‍රීකරණ පෙරහන පද්ධතිය.'
      ],
      specs: {
        capacity: '300 - 500 kg/hr',
        power: '2.2 kW, 380V Three-Phase',
        material: 'Food-Grade SUS304 Stainless Steel',
        weight: '280 kg'
      },
      priceRange: 'LKR 850,000 - 1,200,000',
      imageUrl: 'https://images.unsplash.com/photo-1540324155974-72223a979e29?auto=format&fit=crop&q=80&w=500',
      tags: ['Washing', 'Prep-stage', 'Powders']
    },
    {
      id: 'mac-pow-2',
      nameEN: 'Industrial Dehydrator / Multi-Tier Mesh Belt Dryer',
      nameSI: 'කාර්මික වියළන යන්ත්‍රය / බහු-තට්ටු වාහක වියළනය',
      descriptionEN: 'Utilizes precision-controlled forced hot air or vacuum drying to strip moisture uniformly while fully preserving active polysaccharides and nutritional value.',
      descriptionSI: 'හතු වල ඇති පෝෂණ කොටස් සහ ඖෂධීය ගුණය සුරකිමින්, නියමිත උෂ්ණත්වයකින් යුතුව ඒකාකාරව ජලය ඉවත් කරන වාහක වියළනය.',
      featuresEN: [
        'Multi-tier design for massive volume handling within a compact workspace.',
        'Smart PID microprocessor temperature controller (30°C to 120°C).',
        'Uniform horizontal airflow avoids hotspot scorching.'
      ],
      featuresSI: [
        'ඉඩකඩ ඉතිරි කරමින් විශාල ධාරිතාවක් වියළීමට බහු-තට්ටු සැලසුම.',
        'නියමිත උෂ්ණත්වය පාලනය කරන ස්මාර්ට් PID පද්ධතිය (30°C සිට 120°C).',
        'හතු පිළිස්සීමෙන් තොරව ඒකාකාරව උණුසුම් වායුව ගමන් කරවීම.'
      ],
      specs: {
        capacity: '100 - 200 kg per batch',
        power: '15 kW (Electric heating with fan system)',
        material: 'SUS304 Stainless Steel interior & exterior',
        weight: '650 kg'
      },
      priceRange: 'LKR 1,800,000 - 2,500,000',
      imageUrl: 'https://images.unsplash.com/photo-1555529771-835e59fc5efe?auto=format&fit=crop&q=80&w=500',
      tags: ['Drying', 'Brightsail', 'Powders']
    },
    {
      id: 'mac-pow-3',
      nameEN: 'Coarse Industrial Crusher',
      nameSI: 'රළු කාර්මික කුඩු සහ කැබලි කිරීමේ යන්ත්‍රය',
      descriptionEN: 'Pre-breaks whole dried mushrooms (especially tough Reishi conks or dense shiitake stems) into smaller uniform chunks or flakes.',
      descriptionSI: 'වියළන ලද විශාල හතු හෝ තද රෙයිෂි හතු කොටස් ඊළඟ කුඩු කිරීමේ පියවර සඳහා කුඩා කැබලි බවට පත් කරන යන්ත්‍රය.',
      featuresEN: [
        'Heavy-duty hardened alloy steel rotary cutting blades.',
        'Adjustable screen mesh sizes to customize chunk diameter.',
        'Extremely high torque low-noise industrial motor.'
      ],
      featuresSI: [
        'තද හතු කැපීමට සුදුසු දැඩි මිශ්‍ර ලෝහ කැපුම් තල.',
        'කැබලිවල ප්‍රමාණය වෙනස් කළ හැකි පෙරහන් තහඩු.',
        'ඉහළ කැරකෙන බලයක් සහිත නිහඬ කාර්මික මෝටරය.'
      ],
      specs: {
        capacity: '150 - 300 kg/hr',
        power: '4.0 kW, 380V',
        material: 'Structural Carbon Steel & SUS304 Product Contact',
        weight: '190 kg'
      },
      priceRange: 'LKR 650,000 - 850,000',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=500',
      tags: ['Crushing', 'Pre-Grind', 'Powders']
    },
    {
      id: 'mac-pow-4',
      nameEN: 'Ultra-Fine Pulverizer / Air Classifier Mill (ACM)',
      nameSI: 'අති-සියුම් හතු කුඩු කරන මෝල',
      descriptionEN: 'Grinds dried mushroom flakes into an ultra-fine, highly soluble, uniform powder (60 to 2500 mesh) without overheating the product.',
      descriptionSI: 'හතු කුඩු කිරීමේදී ඇති වන රස්නය පාලනය කරමින් ඉතා සියුම් (මයික්‍රෝන මට්ටමේ) කුඩු බවට පත් කරන උසස් තාක්ෂණික මෝල.',
      featuresEN: [
        'Integrated dynamic air classifier wheel inside the chamber control mesh size.',
        'Water-cooling jacket prevents heat degradation of active mushroom bio-compounds.',
        'Dust-free cyclonic separator discharge system.'
      ],
      featuresSI: [
        'කුඩුවල සියුම් බව පාලනය කරන ඒකාබද්ධ වායු වර්ගීකරණ රෝද පද්ධතිය.',
        'හතු වල ගුණය රකින ජල-සිසිලන ජැකට් (Cooling jacket) පද්ධතිය.',
        'දූවිලි රහිතව කුඩු වෙන්කරන සයික්ලෝන් විසර්ජන පද්ධතිය.'
      ],
      specs: {
        capacity: '50 - 150 kg/hr',
        power: '11 kW Main Motor, 1.5 kW Classify Motor',
        material: 'High-Mirror Polish SUS304 Pharmaceutical Grade',
        weight: '450 kg'
      },
      priceRange: 'LKR 2,400,000 - 3,200,000',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=500',
      tags: ['Grinding', 'Superfine', 'Powders']
    },
    {
      id: 'mac-pow-5',
      nameEN: 'Mushroom Extract & Concentration Production Line',
      nameSI: 'හතු සාරය ලබා ගැනීමේ සහ සාන්ද්‍රණ නිෂ්පාදන පෙළ',
      descriptionEN: 'State-of-the-art dual hot water extraction, filtration, vacuum concentration, and spray drying units to make water-soluble high-potency mushroom extract powders.',
      descriptionSI: 'හතු වල ඇති ජල-ද්‍රාව්‍ය ඖෂධීය කොටස් උණුසුම් ජලයෙන් නිස්සාරණය කර, සාන්ද්‍රණය කර ස්ප්‍රේ ඩ්‍රයර් මඟින් ක්ෂණික ද්‍රාව්‍ය කුඩු සාදන පූර්ණ පද්ධතිය.',
      featuresEN: [
        'Low-temperature vacuum concentration protects thermal-sensitive compounds.',
        'Fully enclosed automated clean-in-place (CIP) configuration.',
        'High-recovery centrifugal spray drying tower yields instant solubility.'
      ],
      featuresSI: [
        'අඩු උෂ්ණත්ව රික්ත සාන්ද්‍රණය මඟින් රස්නයට සංවේදී ඖෂධීය කොටස් ආරක්ෂා කිරීම.',
        'ස්වයංක්‍රීය සේදීම් කළ හැකි සංවෘත සෞඛ්‍යාරක්ෂිත CIP සැකසුම.',
        'ක්ෂණිකව දියවන සාර කුඩු සාදන ස්ප්‍රේ වියළන කුළුණ.'
      ],
      specs: {
        capacity: '500L Extraction Tank Volume',
        power: 'Custom Steam/Electric (Approx 35 kW)',
        material: 'Premium Sanitary-grade SUS316L Stainless Steel',
        weight: '1,800 kg'
      },
      priceRange: 'LKR 8,500,000 - 12,000,000',
      imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=500',
      tags: ['Extraction', 'Soluble', 'Powders']
    },
    {
      id: 'mac-pow-6',
      nameEN: 'Automated Capsule Filling Machine',
      nameSI: 'ස්වයංක්‍රීය කැප්සියුල පිරවුම් යන්ත්‍රය',
      descriptionEN: 'Precisely doses active mushroom powders into hard gelatin or veggie capsules, sealing and polishing them with high-speed accuracy.',
      descriptionSI: 'හතු කුඩු නියමිත මිලිග්‍රෑම් ප්‍රමාණයන්ගෙන් යුතුව නිර්මාංශ හෝ ජෙලටින් කැප්සියුල තුළට පුරවා මුද්‍රා තබන අධිවේගී ස්වයංක්‍රීය යන්ත්‍රය.',
      featuresEN: [
        'Tamping pin technology ensures ultra-precise filling weight variance under 2%.',
        'Segment cleaning and vacuum suction removes residual dust.',
        'PLC touchscreen controls for filling speed and batch sizing.'
      ],
      featuresSI: [
        'මිලිග්‍රෑම් ප්‍රමාණය 98% ක්ම නිවැරදිව පිරවීමේ උසස් තාක්ෂණය.',
        'කැප්සියුල පිටත දූවිලි පිරිසිදු කරන රික්ත චූෂණ පද්ධතිය.',
        'වේගය සහ කාණ්ඩ ප්‍රමාණයන් පාලනය සඳහා PLC ස්පර්ශ තිරය.'
      ],
      specs: {
        capacity: '12,000 - 24,000 capsules/hr',
        power: '3.0 kW, 220V/380V',
        material: 'Strict Medical Grade SUS316 product contact',
        weight: '800 kg'
      },
      priceRange: 'LKR 3,500,000 - 4,800,000',
      imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=500',
      tags: ['Packaging', 'Capsules', 'Powders']
    },
    {
      id: 'mac-pow-7',
      nameEN: 'VFFS Powder Packaging Machine',
      nameSI: 'VFFS සිරස් කුඩු ඇසුරුම්කරණ යන්ත්‍රය',
      descriptionEN: 'Forms custom pouches from flat film roll, dispenses a precise weight of mushroom powder via auger filler, flushes nitrogen, and seals automatically.',
      descriptionSI: 'හතු කුඩු ග්‍රෑම් 50, 100 හෝ 250 ප්‍රමාණයේ සාක්කු (pouches) සාදා, නයිට්‍රජන් වායුව මුදාහැර, ස්වයංක්‍රීයව මුද්‍රා තබන යන්ත්‍රය.',
      featuresEN: [
        'Servo motor-driven auger screws prevent powder static build-up.',
        'Hermetic heat sealing bars for air-tight freshness.',
        'Integrated barcode / expiry date thermal transfer ribbon printer.'
      ],
      featuresSI: [
        'දූවිලි ඇතිවීම වළක්වන සර්වෝ මෝටරයෙන් ක්‍රියාකරන පිරවුම් ඉස්කුරුප්පු.',
        'වාතය කාන්දු නොවන සේ කල්තබා ගැනීමට ශක්තිමත් තාප මුද්‍රා තැබීම.',
        'කල් ඉකුත්වීමේ දිනය සහ තීරු කේත මුද්‍රණය කිරීමේ පහසුකම.'
      ],
      specs: {
        capacity: '30 - 60 bags/min',
        power: '2.5 kW, 220V Single-Phase',
        material: 'SUS304 Stainless Steel frame & food contact',
        weight: '350 kg'
      },
      priceRange: 'LKR 1,500,000 - 2,200,000',
      imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=500',
      tags: ['Packaging', 'Bags', 'Powders']
    }
  ],
  culinary: [
    {
      id: 'mac-cul-1',
      nameEN: 'Sorting & Grading Conveyor',
      nameSI: 'හතු ප්‍රමාණය අනුව වර්ගීකරණ වාහක පද්ධතිය',
      descriptionEN: 'Enables agricultural workers to efficiently sort and grade fresh mushrooms by cap diameter, shape, and overall quality prior to processing.',
      descriptionSI: 'හතු ටින් කිරීමට පෙර ඒවායේ තොප්පියේ ප්‍රමාණය, හැඩය සහ ගුණාත්මකභාවය අනුව පහසුවෙන් වර්ග කිරීමට සහාය වන වාහක පද්ධතිය.',
      featuresEN: [
        'Variable speed control belt paired with bright overhead daylight LED lamps.',
        'Double-sided sorting work stations for up to 8 operators simultaneously.',
        'Soft-drop discharge chutes prevent soft mushroom bruising.'
      ],
      featuresSI: [
        'වේගය වෙනස් කළ හැකි පටිය සහ ඉහළින් සවිකරන ලද දීප්තිමත් LED ලාම්පු.',
        'එක්වර සේවකයින් 8 දෙනෙකුට වැඩ කළ හැකි දෙපස සේවා ස්ථාන.',
        'හතු තැලීම වැළක්වීමට මෘදු විසර්ජන මාර්ග.'
      ],
      specs: {
        capacity: '500 - 1000 kg/hr',
        power: '0.75 kW, 220V',
        material: 'Food-grade PU Belt, SUS304 Frame',
        weight: '150 kg'
      },
      priceRange: 'LKR 350,000 - 550,000',
      imageUrl: 'https://images.unsplash.com/photo-1590682680394-b559491e6026?auto=format&fit=crop&q=80&w=500',
      tags: ['Grading', 'Sorting', 'Culinary']
    },
    {
      id: 'mac-cul-2',
      nameEN: 'Mushroom Root Cutting / Leg Cutting Machine',
      nameSI: 'හතු මුල් සහ නටු කැපීමේ ස්වයංක්‍රීය යන්ත්‍රය',
      descriptionEN: 'Automates the laborious process of clipping away soil-filled straw substrate roots and tough lower stems from fresh mushroom clusters.',
      descriptionSI: 'හතු පොකුරු වල ඇති පස් සහිත කොටස් සහ තද නටු ස්වයංක්‍රීයව හා ඉතා ඉක්මනින් කපා පිරිසිදු කරන යන්ත්‍රය.',
      featuresEN: [
        'Rotary high-speed disc blades with high shear cutting precision.',
        'Continuous feeding guide grooves safely secure mushroom clusters.',
        'Automatic separated chutes for cut roots and clean mushroom caps.'
      ],
      featuresSI: [
        'අධිවේගී කැපුම් තැටි තල මඟින් ඉතා නිවැරදිව නටු කපා දැමීම.',
        'හතු පොකුරු ආරක්ෂිතව රඳවන අඛණ්ඩ මාර්ගෝපදේශ.',
        'කැපූ මුල් සහ පිරිසිදු හතු වෙන වෙනම බැහැර වන ස්වයංක්‍රීය මාර්ග.'
      ],
      specs: {
        capacity: '200 - 400 kg/hr',
        power: '1.5 kW, 220V',
        material: 'SUS304 Stainless Steel',
        weight: '120 kg'
      },
      priceRange: 'LKR 680,000 - 850,000',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500',
      tags: ['Slicing', 'Trimming', 'Culinary']
    },
    {
      id: 'mac-cul-3',
      nameEN: 'High-Speed Industrial Mushroom Slicer',
      nameSI: 'කාර්මික අධිවේගී හතු පෙති කපන යන්ත්‍රය',
      descriptionEN: 'Uses multiple circular razor blades to quickly dice or cleanly slice fresh whole mushrooms without bruising the delicate cell structures.',
      descriptionSI: 'හතු වල පටක වලට හානි නොකරමින් ඒකාකාරී ගනකමකින් යුතුව පෙති හෝ කුඩා කොටස් වලට කපන යන්ත්‍රය.',
      featuresEN: [
        'Ultra-sharp imported carbon steel circular knives.',
        'Adjustable slice thickness ranging from 2mm to 15mm.',
        'High-capacity gravity feed hopper secures fingers and speeds processing.'
      ],
      featuresSI: [
        'සියුම්ව කැපීමට ආනයනික කාබන් වානේ වටකුරු පිහි.',
        'මිලිමීටර් 2 සිට 15 දක්වා පෙතිවල ඝනකම වෙනස් කිරීමේ හැකියාව.',
        'ඇඟිලි වලට ආරක්ෂාව සපයන සහ වේගවත් කරන ගුරුත්වාකර්ෂණ පෝෂක කට.'
      ],
      specs: {
        capacity: '300 - 600 kg/hr',
        power: '1.1 kW, 220V/380V',
        material: 'Anodized Aluminum Alloy & SUS304 Steel',
        weight: '110 kg'
      },
      priceRange: 'LKR 450,000 - 650,000',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=500',
      tags: ['Slicing', 'Processing', 'Culinary']
    },
    {
      id: 'mac-cul-4',
      nameEN: 'Continuous Mushroom Blanching Machine',
      nameSI: 'හතු තම්බා ගැනීමේ සහ වර්ණ රැකගැනීමේ යන්ත්‍රය',
      descriptionEN: 'Pre-cooks/blanches fresh sliced mushrooms to deactivate enzymes, locking in natural color and preparing them for canning/jarring.',
      descriptionSI: 'හතු වල ස්වාභාවික පැහැය රැක ගැනීමට සහ එන්සයිම අක්‍රීය කිරීමට, නියමිත කාලයක් උණු වතුරේ තම්බා ගන්නා යන්ත්‍රය.',
      featuresEN: [
        'Precise water temperature control with automatic steam or electric heating.',
        'Adjustable dwell time to prevent overcooking delicate oyster mushrooms.',
        'Integrated cold spray chilling section to lock crisp texture.'
      ],
      featuresSI: [
        'වාෂ්ප හෝ විදුලි තාපයෙන් ස්වයංක්‍රීය උෂ්ණත්වය පාලනය කිරීම.',
        'හතු ඕනෑවට වඩා තැම්බීම වැළැක්වීමට කාලය පාලනය කිරීමේ පහසුකම.',
        'හතු වල හැපෙනසුළු ගුණය රකින සීතල වතුර ඉසින පසු-කොටස.'
      ],
      specs: {
        capacity: '400 - 800 kg/hr',
        power: '18 kW (Heating element) + 1.5 kW (Belt drive)',
        material: 'Sanitary SUS304 Stainless Steel',
        weight: '500 kg'
      },
      priceRange: 'LKR 2,200,000 - 3,000,000',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500',
      tags: ['Blanching', 'Thermal', 'Culinary']
    },
    {
      id: 'mac-cul-5',
      nameEN: 'Automated Brine/Sauce Filling Line',
      nameSI: 'ස්වයංක්‍රීය ලුණු දියර/සෝස් සහ හතු පිරවුම් පද්ධතිය',
      descriptionEN: 'Fills jars, bottles, or cans with pre-measured quantities of sliced mushrooms and delivers an exact ratio of hot brine/sauce.',
      descriptionSI: 'බෝතල් හෝ ටින් තුළට පෙති කපන ලද හතු සහ නියමිත උණුසුම් ලුණු දියර ප්‍රමාණය ස්වයංක්‍රීයව පුරවන උපකරණ පද්ධතිය.',
      featuresEN: [
        'Piston-displacement liquid injectors prevent spilling or air pockets.',
        'Anti-drip nozzles protect container necks from contamination.',
        'Rotary container feeding table with optical sensors to prevent empty filling.'
      ],
      featuresSI: [
        'දියර පිටාර ගැලීම වැළැක්වීමට පිස්ටන් ක්‍රියාකාරී පිරවුම් කටවල්.',
        'බෝතල් කට අපිරිසිදු වීම වළක්වන බිංදු නොවැටෙන නොසල් (nozzles).',
        'බෝතලයක් නැති විට දියර පිරවීම වළක්වන දෘශ්‍ය සංවේදක (Sensors).'
      ],
      specs: {
        capacity: '20 - 40 jars per minute',
        power: '2.0 kW, 220V',
        material: 'Food-grade SUS304 & Silicon food-grade tubes',
        weight: '300 kg'
      },
      priceRange: 'LKR 1,600,000 - 2,400,000',
      imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=500',
      tags: ['Filling', 'Liquid', 'Culinary']
    },
    {
      id: 'mac-cul-6',
      nameEN: 'Can Seaming & Jar Capping Machine',
      nameSI: 'ටින් සහ බෝතල් මුද්‍රා තැබීමේ යන්ත්‍රය',
      descriptionEN: 'Seals aluminum/tin cans or glass jars under vacuum pressure, locking out ambient air to achieve maximum shelf-life.',
      descriptionSI: 'ටින් හෝ වීදුරු බෝතල්වල මූඩි තද කර, ඇතුළත ඇති වාතය ඉවත් කර (Vacuum) මුද්‍රා තබන අධිවේගී යන්ත්‍රය.',
      featuresEN: [
        'Steam-injection chamber generates vacuum pressure naturally.',
        'Adjustable capping chucks support various thread pitches and jar sizes.',
        'Robust mechanical cam drive for extreme sealing pressure.'
      ],
      featuresSI: [
        'ස්වාභාවික රික්තයක් නිර්මාණය කිරීමට වාෂ්ප විදින කුටීරය.',
        'විවිධ බෝතල් මූඩි ප්‍රමාණ සඳහා ගැළපෙන පරිදි සකස් කළ හැකි මුද්‍රා හිස්.',
        'ඉතා තදින් මුද්‍රා තැබීම සහතික කරන යාන්ත්‍රික කැම් ඩ්‍රයිව් තාක්ෂණය.'
      ],
      specs: {
        capacity: '1,200 - 2,000 cans/hr',
        power: '1.5 kW, 380V Three-Phase',
        material: 'Hardened Chrome-Steel chucks, SUS304 body',
        weight: '420 kg'
      },
      priceRange: 'LKR 1,900,000 - 2,800,000',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=500',
      tags: ['Sealing', 'Capping', 'Culinary']
    },
    {
      id: 'mac-cul-7',
      nameEN: 'Industrial Retort Sterilizer / Autoclave',
      nameSI: 'කාර්මික රිටෝර්ට් විෂබීජහරණ යන්ත්‍රය / ඔටෝක්ලේව්',
      descriptionEN: 'Cook-sterilizes sealed cans or retort pouches at high pressure and extreme temperature (121°C) to make products fully shelf-stable for 2+ years.',
      descriptionSI: 'මුද්‍රා තබන ලද ටින් සහ පැකට්, අධික පීඩනයක් හා උෂ්ණත්වයක් (121°C) යටතේ විෂබීජහරණය කර වසර 2ක් දක්වා කල්තබා ගැනීමට හැකි කරන යන්ත්‍රය.',
      featuresEN: [
        'Durable heavy-pressure vessel with double safety interlocks on the door.',
        'Automatic temperature-holding and rapid water-spray cooling cycles.',
        'Datalogger records critical F-value food safety curves for audit compliance.'
      ],
      featuresSI: [
        'ද්විත්ව ආරක්ෂිත පියන් අගුල් සහිත දැඩි පීඩන භාජනය.',
        'ස්වයංක්‍රීය උෂ්ණත්ව පාලනය සහ ඉක්මනින් සිසිල් කරන ජල ඉසින පද්ධතිය.',
        'ආහාර සුරක්ෂිතතා විගණන සඳහා දත්ත සටහන් කරන ඩිජිටල් රෙකෝඩරය.'
      ],
      specs: {
        capacity: '300 - 500 cans per batch',
        power: '36 kW (Electric) or Steam heating connection',
        material: 'Thick boiler-grade SUS304 vessel steel',
        weight: '1,200 kg'
      },
      priceRange: 'LKR 4,500,000 - 6,500,000',
      imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=500',
      tags: ['Sterilizing', 'Retort', 'Culinary']
    }
  ],
  snacks: [
    {
      id: 'mac-sna-1',
      nameEN: 'Leg Cutter & Slicer (Snack-Prep Edition)',
      nameSI: 'ස්නැක් නටු කපන සහ පෙති කපන විශේෂ යන්ත්‍රය',
      descriptionEN: 'Prepares uniform, perfect-sized mushroom caps and thick slices specifically sized to optimize heat transfer during vacuum frying.',
      descriptionSI: 'රික්ත බැදීම (Vacuum-Frying) සඳහා ඉතා යෝග්‍ය ඒකාකාරී ඝනකමක් ඇති හතු පෙති කපන විශේෂ යන්ත්‍රය.',
      featuresEN: [
        'Custom feeding tray aligns individual mushrooms to minimize scrap waste.',
        'Ultra-sharp razor belt drive for high speed with zero mushing.',
        'Quick-exchange blade plates for dicing, strip cutting, or slicing.'
      ],
      featuresSI: [
        'අපතේ යාම අවම කරන විශේෂිත හතු පෙළගැස්වීමේ තැටිය.',
        'හතු පොඩි වීම වළක්වන අතිශය තියුණු පිහි.',
        'තීරු හෝ කොටස් වලට කැපීම සඳහා ඉක්මනින් මාරු කළ හැකි තල.'
      ],
      specs: {
        capacity: '250 - 500 kg/hr',
        power: '1.5 kW, 220V',
        material: 'SUS304 Stainless Steel & Teflon chutes',
        weight: '135 kg'
      },
      priceRange: 'LKR 550,000 - 750,000',
      imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=500',
      tags: ['Preparation', 'Slicing', 'Snacks']
    },
    {
      id: 'mac-sna-2',
      nameEN: 'Flavor Marinating & Vacuum Tumble Tank',
      nameSI: 'සුවඳ සහ රස කැවීම් සඳහා වන රික්ත ටම්බ්ලර් ටැංකිය',
      descriptionEN: 'Vacuum-tumbles the blanched mushroom pieces so that seasonings, marinades, or light prebiotic oils are thoroughly and evenly absorbed deep into the tissues.',
      descriptionSI: 'හතු පෙති තුළට ලුණු, කුළුබඩු හෝ තෙල් ඒකාකාරව උරා ගැනීමට සලස්වන භ්‍රමණ රික්ත ටැංකිය.',
      featuresEN: [
        'Vacuum suction opens mushroom pores for rapid flavor infusion.',
        'Slow horizontal tumbling prevents physical disintegration of delicate caps.',
        'Adjustable rotation cycles and batch timers.'
      ],
      featuresSI: [
        'සුවඳ සහ රස ඉක්මනින් උරා ගැනීමට හතු සිදුරු විවෘත කරන රික්ත පද්ධතිය.',
        'හතු කැබලි කැඩී යාම වළක්වන මෘදු තිරස් පෙරලීම් පහසුකම.',
        'භ්‍රමණ වේගය සහ කාලය වෙනස් කිරීමේ හැකියාව.'
      ],
      specs: {
        capacity: '100 - 150 kg per batch',
        power: '1.5 kW, 220V',
        material: 'Satin-polish Food Grade SUS304 Stainless Steel',
        weight: '210 kg'
      },
      priceRange: 'LKR 880,000 - 1,200,000',
      imageUrl: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=500',
      tags: ['Flavoring', 'Vacuum', 'Snacks']
    },
    {
      id: 'mac-sna-3',
      nameEN: 'Advanced Vacuum Frying Equipment (VF Line)',
      nameSI: 'උසස් රික්ත බැදීමේ යන්ත්‍රය (VF Line)',
      descriptionEN: 'Fries seasoned mushrooms under a vacuum at low temperatures (80-90°C). Safely removes moisture to create an ultra-crispy snack while retaining the natural color and avoiding carcinogens from oil degradation.',
      descriptionSI: 'අඩු උෂ්ණත්වයකදී (80-90°C) සහ රික්ත පීඩනයක් යටතේ හතු බැද, හැපෙනසුළු කරන යන්ත්‍රය. මෙහිදී තෙල් විනාශ වීම වැළැක්වෙන අතර ස්වාභාවික වර්ණය රැකේ.',
      featuresEN: [
        'Integrated dynamic vacuum pump pulls sub-atmospheric pressure.',
        'In-pot heating coil maintains precise vegetable oil temperature.',
        'Preserves cellular structure, flavor profile, and nutritional minerals.'
      ],
      featuresSI: [
        'අධි පීඩන රික්තයක් නිර්මාණය කරන ඒකාබද්ධ රික්ත පොම්පය.',
        'තෙල්වල උෂ්ණත්වය නියමිත පරිදි පාලනය කරන තාප දඟර.',
        'හතු වල සෛලීය ව්‍යුහය, රසය සහ පෝෂණ ගුණය ආරක්ෂා කිරීම.'
      ],
      specs: {
        capacity: '50 - 100 kg per batch',
        power: 'Heating power 45 kW, Vacuum motor 5.5 kW',
        material: 'Heavy industrial SUS304 double-jacket pot',
        weight: '1,500 kg'
      },
      priceRange: 'LKR 6,500,000 - 8,500,000',
      imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=500',
      tags: ['Frying', 'Vacuum', 'Snacks']
    },
    {
      id: 'mac-sna-4',
      nameEN: 'Centrifugal High-Speed De-oiling Machine',
      nameSI: 'අධිවේගී කේන්ද්‍රාපසාරී තෙල් ඉවත් කිරීමේ යන්ත්‍රය',
      descriptionEN: 'Spins the vacuum-fried mushroom chips at high speeds under a vacuum to strip away excess surface oil, keeping the snack low-fat and shelf-stable.',
      descriptionSI: 'හතු බැදගත් පසු ඒවායේ මතුපිට ඇති අමතර තෙල් ඉවත් කිරීම සඳහා අධිවේගයෙන් කරකවන කේන්ද්‍රාපසාරී යන්ත්‍රය.',
      featuresEN: [
        'Direct-drive frequency inverter allows precise speed selection up to 1200 RPM.',
        'Soft-start acceleration minimizes chip damage or fragmentation.',
        'Pneumatic dynamic bottom discharge door for automated process line setups.'
      ],
      featuresSI: [
        'විනාඩියකට වට 1200 දක්වා වේගය වෙනස් කළ හැකි සංඛ්‍යාත ඉන්වර්ටරය.',
        'චිප්ස් කැඩී යාම වැළැක්වීමට මෘදු ලෙස කරකැවීම ආරම්භ කිරීමේ පහසුකම.',
        'නිෂ්පාදන ස්වයංක්‍රීයව බැහැර කිරීම සඳහා වන වායු ක්‍රියාකාරී පියන.'
      ],
      specs: {
        capacity: '60 - 120 kg/hr',
        power: '2.2 kW, 380V',
        material: 'SUS304 Stainless Steel with dynamically balanced basket',
        weight: '250 kg'
      },
      priceRange: 'LKR 750,000 - 950,000',
      imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=500',
      tags: ['De-oiling', 'Centrifugation', 'Snacks']
    },
    {
      id: 'mac-sna-5',
      nameEN: 'Nitrogen-Flush Snack Packaging Machine',
      nameSI: 'නයිට්‍රජන් වායු ඇතුළත් කිරීමේ ඇසුරුම්කරණ යන්ත්‍රය',
      descriptionEN: 'Bags the crispy mushroom chips with a precise nitrogen gas flush to prevent crushing during transit and block oxygen-induced staling.',
      descriptionSI: 'හතු චිප්ස් කැබලි වීම වැළැක්වීමට සහ වාතය සමඟ ප්‍රතික්‍රියා කර නරක් වීම වැළැක්වීමට නයිට්‍රජන් වායුව ඇතුළත් කර ඇසුරුම් කරන යන්ත්‍රය.',
      featuresEN: [
        'Dual nitrogen-purge gas needles integrated within the sealing bar.',
        'High-accuracy multi-head computer combination weigher dispenser.',
        'Polished safety jaw mechanism protects delicate snack bags.'
      ],
      featuresSI: [
        'මුද්‍රා තැබීමට පෙර පැකට්ටුවට නයිට්‍රජන් වායුව විදින ද්විත්ව කටු පද්ධතිය.',
        'නිවැරදි බර මැන බෑග් වලට දමන පරිගණකගත බහු-හිස් තරාදි පද්ධතිය.',
        'චිප්ස් තැලී යාම වළක්වන සියුම් මුද්‍රා තැබීමේ හකු යාන්ත්‍රණය.'
      ],
      specs: {
        capacity: '40 - 70 bags/min',
        power: '3.5 kW, 220V',
        material: 'SUS304 Food Sanitary Grade',
        weight: '480 kg'
      },
      priceRange: 'LKR 2,600,000 - 3,500,000',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500',
      tags: ['Packaging', 'Nitrogen', 'Snacks']
    }
  ]
};

export default function Machinery({ language, currentUserEmail, currentUserId, currentUserRole }: MachineryProps) {
  const [activeCategory, setActiveCategory] = useState<'powders' | 'culinary' | 'snacks'>('powders');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic machinery items state
  const [allMachines, setAllMachines] = useState<MachineItem[]>([]);
  const [loadingMachines, setLoadingMachines] = useState(true);

  // Admin & Staff management states
  const canManage = currentUserRole === 'admin' || currentUserRole === 'staff';
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState<MachineItem | null>(null);
  const [savingMachine, setSavingMachine] = useState(false);
  
  const [machineForm, setMachineForm] = useState({
    nameEN: '',
    nameSI: '',
    category: 'powders' as 'powders' | 'culinary' | 'snacks',
    descriptionEN: '',
    descriptionSI: '',
    capacity: '200 - 400 kg/hr',
    power: '2.2 kW, 380V Three-Phase',
    material: 'SUS304 Stainless Steel',
    weight: '250 kg',
    priceRange: 'LKR 850,000 - 1,200,000',
    imageUrl: 'https://images.unsplash.com/photo-1540324155974-72223a979e29?auto=format&fit=crop&q=80&w=500',
    tagsStr: 'Washing, Prep-stage',
    featuresENStr: 'High-pressure water bubbling; Continuous conveyor belt; Water recycling filtration',
    featuresSIStr: 'හතු තොප්පියට හානි නොවන සේ පිරිසිදු කිරීම; ස්වයංක්‍රීය වාහක පටිය; ප්‍රතිචක්‍රීකරණ පෙරහන'
  });

  // Modal State
  const [selectedMachine, setSelectedMachine] = useState<MachineItem | null>(null);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  
  // Inquiry Form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: currentUserEmail || '',
    intendedProduct: 'Mushroom Supplements',
    dailyCapacity: '200 kg / day',
    location: '',
    message: ''
  });

  const loadMachineryData = async () => {
    setLoadingMachines(true);
    try {
      const items = await dataService.getMachineryItems();
      setAllMachines(items);
    } catch (e) {
      console.error('Failed loading machinery catalog:', e);
    } finally {
      setLoadingMachines(false);
    }
  };

  useEffect(() => {
    loadMachineryData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingMachine(null);
    setMachineForm({
      nameEN: '',
      nameSI: '',
      category: activeCategory,
      descriptionEN: '',
      descriptionSI: '',
      capacity: '200 - 400 kg/hr',
      power: '2.2 kW, 380V Three-Phase',
      material: 'SUS304 Stainless Steel',
      weight: '250 kg',
      priceRange: 'LKR 850,000 - 1,200,000',
      imageUrl: 'https://images.unsplash.com/photo-1540324155974-72223a979e29?auto=format&fit=crop&q=80&w=500',
      tagsStr: 'Industrial, Processing',
      featuresENStr: 'High efficiency; Food-grade stainless build; Easy maintenance',
      featuresSIStr: 'ඉහළ කාර්යක්ෂමතාව; ආහාර සුදුසු ලෝහ නිෂ්පාදනය; පහසු නඩත්තුව'
    });
    setShowAddEditModal(true);
  };

  const handleOpenEditModal = (m: MachineItem) => {
    setEditingMachine(m);
    setMachineForm({
      nameEN: m.nameEN,
      nameSI: m.nameSI,
      category: m.category,
      descriptionEN: m.descriptionEN,
      descriptionSI: m.descriptionSI,
      capacity: m.specs?.capacity || '',
      power: m.specs?.power || '',
      material: m.specs?.material || '',
      weight: m.specs?.weight || '',
      priceRange: m.priceRange,
      imageUrl: m.imageUrl,
      tagsStr: (m.tags || []).join(', '),
      featuresENStr: (m.featuresEN || []).join('; '),
      featuresSIStr: (m.featuresSI || []).join('; ')
    });
    setShowAddEditModal(true);
  };

  const handleDeleteMachine = async (id: string) => {
    if (!confirm(language === 'EN' ? 'Are you sure you want to delete this machinery item?' : 'මෙම යන්ත්‍රෝපකරණ විස්තරය ඉවත් කිරීමට ඔබට විශ්වාසද?')) return;
    await dataService.deleteMachineryItem(id);
    await loadMachineryData();
  };

  const handleSaveMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineForm.nameEN || !machineForm.priceRange) return;
    setSavingMachine(true);
    try {
      const itemPayload = {
        category: machineForm.category,
        nameEN: machineForm.nameEN,
        nameSI: machineForm.nameSI || machineForm.nameEN,
        descriptionEN: machineForm.descriptionEN,
        descriptionSI: machineForm.descriptionSI || machineForm.descriptionEN,
        featuresEN: machineForm.featuresENStr.split(';').map(s => s.trim()).filter(Boolean),
        featuresSI: machineForm.featuresSIStr.split(';').map(s => s.trim()).filter(Boolean),
        specs: {
          capacity: machineForm.capacity,
          power: machineForm.power,
          material: machineForm.material,
          weight: machineForm.weight
        },
        priceRange: machineForm.priceRange,
        imageUrl: machineForm.imageUrl || 'https://images.unsplash.com/photo-1540324155974-72223a979e29?auto=format&fit=crop&q=80&w=500',
        tags: machineForm.tagsStr.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingMachine) {
        await dataService.updateMachineryItem(editingMachine.id, itemPayload);
      } else {
        await dataService.addMachineryItem(itemPayload);
      }
      setShowAddEditModal(false);
      await loadMachineryData();
    } catch (err) {
      console.error('Error saving machine:', err);
    } finally {
      setSavingMachine(false);
    }
  };

  const handleOpenInquiry = (machine: MachineItem) => {
    setSelectedMachine(machine);
    setFormData({
      name: '',
      phone: '',
      email: currentUserEmail || '',
      intendedProduct: activeCategory === 'powders' ? 'Mushroom Powders & Supplements' : activeCategory === 'culinary' ? 'Canned / Sliced Culinary Mushrooms' : 'Crispy Mushroom Snacks',
      dailyCapacity: '200 kg / day',
      location: '',
      message: `We would like to request a formal quotation, technical catalog, and shipping lead time for the "${machine.nameEN}". Please let us know the electrical compliance options and warranty terms in Sri Lanka.`
    });
    setInquirySuccess(false);
    setInquiryError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;

    if (!formData.name || !formData.phone || !formData.email || !formData.location) {
      setInquiryError(language === 'EN' ? 'Please fill in all required fields.' : 'කරුණාකර සියලුම අත්‍යවශ්‍ය ක්ෂේත්‍ර පුරවන්න.');
      return;
    }

    setSubmittingInquiry(true);
    setInquiryError('');

    try {
      await dataService.addMachineryInquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        machineName: selectedMachine.nameEN,
        category: CATEGORY_INFO[activeCategory].titleEN,
        intendedProduct: formData.intendedProduct,
        dailyCapacity: formData.dailyCapacity,
        location: formData.location,
        message: formData.message,
        status: 'New'
      });
      setInquirySuccess(true);
    } catch (err) {
      setInquiryError(language === 'EN' ? 'Could not submit inquiry. Please try again.' : 'විමසීම ඉදිරිපත් කිරීමට නොහැකි විය. නැවත උත්සාහ කරන්න.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // Filter items based on activeCategory and search query
  const categoryMachines = allMachines.filter(m => m.category === activeCategory);
  const filteredMachines = categoryMachines.filter(machine => {
    const query = searchQuery.toLowerCase();
    return (
      machine.nameEN.toLowerCase().includes(query) ||
      (machine.nameSI && machine.nameSI.includes(query)) ||
      machine.descriptionEN.toLowerCase().includes(query) ||
      (machine.tags && machine.tags.some(t => t.toLowerCase().includes(query)))
    );
  });

  const CatIcon = CATEGORY_INFO[activeCategory].icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12" id="machinery-container">
      
      {/* Intro Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-light-green/20 rounded-full text-brand-dark-green text-xs font-serif font-bold uppercase tracking-wider">
          <Wrench className="h-3.5 w-3.5 text-[#5A5A40]" />
          <span>{language === 'EN' ? 'Industrial Co-operative Tech' : 'කාර්මික සමුපකාර තාක්ෂණය'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-dark-green tracking-tight">
          {language === 'EN' ? 'Mushroom Processing Machinery' : 'හතු සැකසුම් යන්ත්‍රෝපකරණ'}
        </h1>
        <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
          {language === 'EN' 
            ? 'We supply premium food-grade machinery blueprints and equipment to help Sri Lankan growers transition from fresh farming to high-margin processed powders, canned culinary foods, and crispy snacks.'
            : 'ශ්‍රී ලංකාවේ හතු වගාකරුවන්ට සාම්ප්‍රදායික වගාවෙන් ඔබ්බට ගොස් හතු කුඩු, ටින් කල හතු සහ චිප්ස් වැනි ඉහළ ලාභදායී අගය එකතු කල නිෂ්පාදන සිදු කිරීම සඳහා අවශ්‍ය උසස්ම යන්ත්‍රෝපකරණ අප සපයන්නෙමු.'}
        </p>
      </div>

      {/* Grid of Categories Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(Object.keys(CATEGORY_INFO) as Array<keyof typeof CATEGORY_INFO>).map((key) => {
          const cat = CATEGORY_INFO[key];
          const isActive = activeCategory === key;
          const Icon = cat.icon;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveCategory(key);
                setSearchQuery('');
              }}
              className={`p-6 rounded-[28px] text-left border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-48 ${
                isActive 
                  ? 'bg-white border-[#8B4513] shadow-md ring-1 ring-[#8B4513]' 
                  : 'bg-white/80 hover:bg-white border-[#5A5A40]/10 hover:border-[#5A5A40]/30 shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <div className={`p-3 rounded-2xl w-fit ${isActive ? 'bg-[#8B4513] text-white' : 'bg-[#5A5A40]/10 text-[#5A5A40]'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif font-bold text-[#2D2D2A] text-sm sm:text-base leading-tight mt-3">
                  {language === 'EN' ? cat.titleEN : cat.titleSI}
                </h3>
              </div>
              
              <span className={`text-xs font-semibold flex items-center space-x-1 mt-2 ${isActive ? 'text-[#8B4513]' : 'text-stone-400 group-hover:text-stone-600'}`}>
                <span>{language === 'EN' ? 'Browse Catalog' : 'නැරඹීමට ක්ලික් කරන්න'}</span>
                <ChevronRight className={`h-3 w-3 transition-transform ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Banner Details */}
      <div className="bg-gradient-to-br from-[#8B4513]/5 to-[#5A5A40]/5 border border-[#5A5A40]/10 rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center space-x-2 text-[#8B4513] font-serif font-bold text-sm">
            <CatIcon className="h-5 w-5" />
            <span>{language === 'EN' ? CATEGORY_INFO[activeCategory].titleEN : CATEGORY_INFO[activeCategory].titleSI}</span>
          </div>
          <p className="text-stone-700 text-sm leading-relaxed">
            {language === 'EN' ? CATEGORY_INFO[activeCategory].descEN : CATEGORY_INFO[activeCategory].descSI}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur border border-[#5A5A40]/10 py-3 px-5 rounded-2xl flex items-center space-x-2 shrink-0">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span className="text-xs font-serif font-bold text-brand-dark-green">
            {language === 'EN' ? '1-Year Co-op Warranty Included' : 'වසරක සමුපකාර වගකීමක් සහිතයි'}
          </span>
        </div>
      </div>

      {/* Search & Statistics Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#5A5A40]/10 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder={language === 'EN' ? 'Search machines, specs, or tags...' : 'යන්ත්‍ර, පිරිවිතර හෝ ටැග් සොයන්න...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-[#5A5A40]/20 rounded-xl bg-stone-50 outline-none focus:bg-white focus:border-[#8B4513] transition"
          />
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-stone-500 text-xs font-serif italic shrink-0">
            Showing {filteredMachines.length} of {categoryMachines.length} Machinery Items
          </div>
          {canManage && (
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 bg-brand-dark-green hover:bg-brand-natural-green text-white font-serif font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>{language === 'EN' ? 'Add Machinery' : 'යන්ත්‍රයක් එකතු කරන්න'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Machinery Catalog list */}
      {filteredMachines.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-[32px] space-y-3">
          <Info className="h-10 w-10 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-700">No Matching Machinery Found</h3>
          <p className="text-stone-400 text-xs max-w-md mx-auto">Try clearing your search query or switching machinery categories above to explore alternative options.</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs text-[#8B4513] hover:underline font-serif font-bold"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredMachines.map((machine, index) => (
            <div 
              key={machine.id} 
              className="bg-white rounded-[32px] border border-[#5A5A40]/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              id={machine.id}
            >
              {/* Header Image & Tags */}
              <div className="relative h-48 sm:h-56 bg-stone-100 overflow-hidden">
                <img 
                  src={machine.imageUrl} 
                  alt={machine.nameEN} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                  {machine.tags && machine.tags.map(tag => (
                    <span key={tag} className="bg-white/90 backdrop-blur text-[10px] text-[#8B4513] font-serif font-bold uppercase tracking-wider py-1 px-2.5 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Admin & Staff Edit / Delete actions */}
                {canManage && (
                  <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl">
                    <button
                      onClick={() => handleOpenEditModal(machine)}
                      className="p-1.5 bg-white/90 hover:bg-white text-stone-700 rounded-lg shadow-xs transition"
                      title="Edit Machine"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMachine(machine.id)}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition"
                      title="Delete Machine"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] text-amber-300 font-bold tracking-widest uppercase block mb-1">
                    BP #{index + 1} • Model Series
                  </span>
                  <h3 className="text-white font-serif font-bold text-lg leading-tight">
                    {language === 'EN' ? machine.nameEN : machine.nameSI}
                  </h3>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 space-y-6 flex-1">
                {/* Short Description */}
                <p className="text-stone-600 text-xs leading-relaxed">
                  {language === 'EN' ? machine.descriptionEN : machine.descriptionSI}
                </p>

                {/* Bullets */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-bold text-brand-dark-green uppercase tracking-wider font-serif">
                    {language === 'EN' ? 'Key Features & Design' : 'ප්‍රධාන ක්‍රියාකාරීත්ව සැලසුම'}
                  </h4>
                  <ul className="space-y-2">
                    {(language === 'EN' ? machine.featuresEN : machine.featuresSI).map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2 text-stone-700 text-[11px] leading-relaxed">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Specifications Specs */}
                <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl space-y-2 text-[11px] font-mono">
                  <div className="flex justify-between border-b border-stone-200/50 pb-1.5 text-stone-500">
                    <span>Specification Field</span>
                    <span className="text-stone-700 font-semibold">Value / Metric</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Prod. Capacity:</span>
                    <span className="text-[#2D2D2A] font-semibold">{machine.specs.capacity}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Power / Voltage:</span>
                    <span className="text-[#2D2D2A] font-semibold">{machine.specs.power}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Build Material:</span>
                    <span className="text-[#2D2D2A] font-semibold">{machine.specs.material}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Machine Weight:</span>
                    <span className="text-[#2D2D2A] font-semibold">{machine.specs.weight}</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Inquiry Action Button */}
              <div className="p-6 sm:p-8 pt-0 border-t border-stone-100 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-stone-400 font-serif block uppercase tracking-wider">
                    {language === 'EN' ? 'Estimated Price' : 'ඇස්තමේන්තුගත මිල'}
                  </span>
                  <span className="text-base sm:text-lg font-serif font-bold text-[#8B4513] tracking-tight">
                    {machine.priceRange}
                  </span>
                </div>
                
                <button
                  onClick={() => handleOpenInquiry(machine)}
                  className="bg-[#5A5A40] hover:bg-[#8B4513] text-white font-serif font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 transition duration-200 shadow-sm"
                >
                  <span>{language === 'EN' ? 'Request Quote' : 'මිල ගණන් විමසන්න'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inquiry Form Modal pop-up */}
      {selectedMachine && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#5A5A40]/15 rounded-[32px] max-w-xl w-full shadow-2xl relative my-8 overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#8B4513]/10 to-[#5A5A40]/10 border-b border-stone-100 relative">
              <button
                onClick={() => setSelectedMachine(null)}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-stone-200/50 text-stone-500 hover:text-stone-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="space-y-1 pr-6">
                <span className="text-[10px] text-[#8B4513] font-bold uppercase tracking-widest block">
                  Mushroom Co-operative Procurement
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark-green leading-tight">
                  {language === 'EN' ? 'Machinery Purchase Inquiry' : 'යන්ත්‍රෝපකරණ මිලදී ගැනීමේ විමසීම'}
                </h3>
                <p className="text-stone-500 text-xs">
                  Requesting: <strong className="text-stone-700 font-semibold">{selectedMachine.nameEN}</strong>
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[70vh]">
              {inquirySuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-xl text-brand-dark-green">
                      {language === 'EN' ? 'Inquiry Submitted Successfully!' : 'විමසීම සාර්ථකව යොමු කරන ලදී!'}
                    </h4>
                    <p className="text-stone-500 text-xs leading-relaxed max-w-md mx-auto">
                      {language === 'EN'
                        ? 'Thank you for your interest. The Mushroom Eco Hub operations and engineering team will review your specifications, verify local power/3-phase availability, and email a complete commercial quotation with shipping estimates.'
                        : 'ඔබගේ කැමැත්තට ස්තූතියි. අපගේ ඉංජිනේරු කණ්ඩායම විසින් විමසීම සමාලෝචනය කර, විදුලි සැපයුම් ගැළපීම් සහ නැව්ගත කිරීමේ ගාස්තු ඇතුළත් මිල ගණන් පත්‍රිකාවක් ඔබ වෙත එවනු ඇත.'}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={() => setSelectedMachine(null)}
                      className="py-2.5 px-6 bg-[#5A5A40] hover:bg-[#8B4513] text-white font-serif font-bold rounded-xl text-xs transition-colors"
                    >
                      {language === 'EN' ? 'Return to Catalog' : 'නැවත කැටලොගයට'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  {inquiryError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-xl text-red-800 text-xs font-semibold">
                      {inquiryError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-serif font-bold text-xs mb-1">
                        Full Name / Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Nimal Perera"
                        className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs text-[#2D2D2A] bg-stone-50 outline-none focus:bg-white focus:border-[#8B4513]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-serif font-bold text-xs mb-1">
                        Contact Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 0771234567"
                        className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs text-[#2D2D2A] bg-stone-50 outline-none focus:bg-white focus:border-[#8B4513]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-serif font-bold text-xs mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="yourname@domain.com"
                        className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs text-[#2D2D2A] bg-stone-50 outline-none focus:bg-white focus:border-[#8B4513]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-serif font-bold text-xs mb-1">
                        Delivery District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Kurunegala / Colombo"
                        className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs text-[#2D2D2A] bg-stone-50 outline-none focus:bg-white focus:border-[#8B4513]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-serif font-bold text-xs mb-1">
                        Intended Mushroom Product
                      </label>
                      <select
                        name="intendedProduct"
                        value={formData.intendedProduct}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs text-[#2D2D2A] bg-stone-50 outline-none focus:bg-white focus:border-[#8B4513]"
                      >
                        <option value="Mushroom Powders">Mushroom Powders & Seasoning</option>
                        <option value="Mushroom Extracts">Mushroom Extracts & Supplements</option>
                        <option value="Canned / Sliced Culinary">Canned / Sliced Culinary Mushrooms</option>
                        <option value="Mushroom Chips / Jerky">Mushroom Chips / Jerky Snacks</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-700 font-serif font-bold text-xs mb-1">
                        Target Daily Capacity
                      </label>
                      <select
                        name="dailyCapacity"
                        value={formData.dailyCapacity}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs text-[#2D2D2A] bg-stone-50 outline-none focus:bg-white focus:border-[#8B4513]"
                      >
                        <option value="Under 50 kg / day">Under 50 kg / day (Small-scale)</option>
                        <option value="50 - 200 kg / day">50 - 200 kg / day (Medium-scale)</option>
                        <option value="200 - 1,000 kg / day">200 - 1,000 kg / day (Industrial)</option>
                        <option value="Over 1 Ton / day">Over 1 Ton / day (High-capacity line)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-serif font-bold text-xs mb-1">
                      Technical Requirements / Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs text-[#2D2D2A] bg-stone-50 outline-none focus:bg-white focus:border-[#8B4513]"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={submittingInquiry}
                      className="w-full py-3 bg-[#5A5A40] hover:bg-[#8B4513] disabled:bg-stone-300 text-white font-serif font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition"
                    >
                      <Send className="h-4 w-4" />
                      <span>{submittingInquiry ? 'Sending Secure Inquiry...' : 'Submit Procurement Request'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Admin / Staff Add/Edit Machinery Modal */}
      {showAddEditModal && canManage && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-2xl w-full shadow-2xl relative my-8 overflow-hidden border border-stone-200">
            <div className="p-6 bg-brand-dark-green text-white flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-lg">
                  {editingMachine ? (language === 'EN' ? 'Edit Machinery Blueprint' : 'යන්ත්‍ර තොරතුරු සංස්කරණය') : (language === 'EN' ? 'Add New Machinery Item' : 'අලුත් යන්ත්‍රයක් එකතු කරන්න')}
                </h3>
                <p className="text-stone-200 text-xs font-sans">
                  {language === 'EN' ? 'Configure industrial mushroom machinery catalog specs.' : 'යන්ත්‍රෝපකරණ විස්තර සහ පිරිවිතර සකසන්න.'}
                </p>
              </div>
              <button onClick={() => setShowAddEditModal(false)} className="p-1 rounded-full hover:bg-white/20 text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMachine} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Machine Name (EN)*</label>
                  <input
                    type="text"
                    required
                    value={machineForm.nameEN}
                    onChange={(e) => setMachineForm({ ...machineForm, nameEN: e.target.value })}
                    placeholder="e.g. Commercial Air Washer Machine"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-brand-dark-green bg-stone-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Machine Name (SI)</label>
                  <input
                    type="text"
                    value={machineForm.nameSI}
                    onChange={(e) => setMachineForm({ ...machineForm, nameSI: e.target.value })}
                    placeholder="e.g. වාණිජ සේදුම් යන්ත්‍රය"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-brand-dark-green bg-stone-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Category*</label>
                  <select
                    value={machineForm.category}
                    onChange={(e) => setMachineForm({ ...machineForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-brand-dark-green bg-stone-50/50"
                  >
                    <option value="powders">Powders, Extracts & Supplements</option>
                    <option value="culinary">Culinary Canned, Jarred & Sliced</option>
                    <option value="snacks">Crispy Mushroom Snacks (Chips/Jerky)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Estimated Price Range*</label>
                  <input
                    type="text"
                    required
                    value={machineForm.priceRange}
                    onChange={(e) => setMachineForm({ ...machineForm, priceRange: e.target.value })}
                    placeholder="e.g. LKR 850,000 - 1,200,000"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-brand-dark-green bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Image URL</label>
                <input
                  type="url"
                  value={machineForm.imageUrl}
                  onChange={(e) => setMachineForm({ ...machineForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-brand-dark-green bg-stone-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Description (EN)</label>
                  <textarea
                    rows={3}
                    value={machineForm.descriptionEN}
                    onChange={(e) => setMachineForm({ ...machineForm, descriptionEN: e.target.value })}
                    placeholder="English description..."
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-brand-dark-green bg-stone-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Description (SI)</label>
                  <textarea
                    rows={3}
                    value={machineForm.descriptionSI}
                    onChange={(e) => setMachineForm({ ...machineForm, descriptionSI: e.target.value })}
                    placeholder="සිංහල විස්තරය..."
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-brand-dark-green bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="bg-stone-50 p-4 rounded-xl space-y-3 border border-stone-200">
                <h4 className="text-xs font-bold text-brand-dark-green uppercase">Technical Specifications</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600">Capacity</label>
                    <input
                      type="text"
                      value={machineForm.capacity}
                      onChange={(e) => setMachineForm({ ...machineForm, capacity: e.target.value })}
                      placeholder="e.g. 300 - 500 kg/hr"
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600">Power / Voltage</label>
                    <input
                      type="text"
                      value={machineForm.power}
                      onChange={(e) => setMachineForm({ ...machineForm, power: e.target.value })}
                      placeholder="e.g. 2.2 kW, 380V"
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600">Material</label>
                    <input
                      type="text"
                      value={machineForm.material}
                      onChange={(e) => setMachineForm({ ...machineForm, material: e.target.value })}
                      placeholder="e.g. SUS304 Stainless Steel"
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600">Weight</label>
                    <input
                      type="text"
                      value={machineForm.weight}
                      onChange={(e) => setMachineForm({ ...machineForm, weight: e.target.value })}
                      placeholder="e.g. 280 kg"
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={machineForm.tagsStr}
                  onChange={(e) => setMachineForm({ ...machineForm, tagsStr: e.target.value })}
                  placeholder="Washing, Prep-stage, Powders"
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-brand-dark-green bg-stone-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Features EN (semicolon separated ;)</label>
                  <textarea
                    rows={2}
                    value={machineForm.featuresENStr}
                    onChange={(e) => setMachineForm({ ...machineForm, featuresENStr: e.target.value })}
                    placeholder="Feature 1; Feature 2; Feature 3"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-brand-dark-green bg-stone-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Features SI (semicolon separated ;)</label>
                  <textarea
                    rows={2}
                    value={machineForm.featuresSIStr}
                    onChange={(e) => setMachineForm({ ...machineForm, featuresSIStr: e.target.value })}
                    placeholder="විශේෂාංගය 1; විශේෂාංගය 2"
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-brand-dark-green bg-stone-50/50"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={savingMachine}
                  className="flex-1 py-3 bg-brand-dark-green hover:bg-brand-natural-green disabled:bg-stone-300 text-white font-bold rounded-xl text-xs transition"
                >
                  {savingMachine ? 'Saving...' : (editingMachine ? 'Save Changes' : 'Create Machinery Item')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="py-3 px-6 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
