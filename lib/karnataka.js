// Static reference data for the New Registration form's location dropdowns.
// Nava Dishe is a Karnataka-only programme, so State is fixed and District /
// City are picked from this list rather than free-typed.
//
// CITIES_BY_DISTRICT maps each district to its taluks / major towns (the
// taluk headquarters plus commonly-named towns). It is not every village —
// if a school's town is missing, add it to the relevant array here.

export const KARNATAKA_STATE = 'Karnataka';

export const KARNATAKA_DISTRICTS = [
  'Bagalkote',
  'Ballari',
  'Belagavi',
  'Bengaluru Rural',
  'Bengaluru Urban',
  'Bidar',
  'Chamarajanagara',
  'Chikkaballapura',
  'Chikkamagaluru',
  'Chitradurga',
  'Dakshina Kannada',
  'Davanagere',
  'Dharwad',
  'Gadag',
  'Hassan',
  'Haveri',
  'Kalaburagi',
  'Kodagu',
  'Kolar',
  'Koppal',
  'Mandya',
  'Mysuru',
  'Raichur',
  'Ramanagara',
  'Shivamogga',
  'Tumakuru',
  'Udupi',
  'Uttara Kannada',
  'Vijayanagara',
  'Vijayapura',
  'Yadgir',
];

export const KARNATAKA_CITIES_BY_DISTRICT = {
  'Bagalkote': ['Bagalkote', 'Badami', 'Bilagi', 'Guledgudda', 'Hungund', 'Ilkal', 'Jamkhandi', 'Mudhol', 'Rabkavi Banhatti', 'Terdal'],
  'Ballari': ['Ballari', 'Kampli', 'Kurugodu', 'Sanduru', 'Siruguppa', 'Toranagallu'],
  'Belagavi': ['Belagavi', 'Athani', 'Bailhongal', 'Chikkodi', 'Gokak', 'Hukkeri', 'Kagwad', 'Khanapur', 'Kittur', 'Mudalgi', 'Nippani', 'Raibag', 'Ramdurg', 'Savadatti', 'Yaragatti'],
  'Bengaluru Rural': ['Devanahalli', 'Doddaballapura', 'Hoskote', 'Nelamangala'],
  'Bengaluru Urban': ['Bengaluru', 'Anekal', 'Attibele', 'Electronic City', 'Kengeri', 'Krishnarajapuram', 'Yelahanka'],
  'Bidar': ['Bidar', 'Aurad', 'Basavakalyan', 'Bhalki', 'Chitguppa', 'Hulsoor', 'Humnabad', 'Kamalnagar'],
  'Chamarajanagara': ['Chamarajanagara', 'Gundlupet', 'Hanur', 'Kollegala', 'Yelandur'],
  'Chikkaballapura': ['Chikkaballapura', 'Bagepalli', 'Chintamani', 'Gauribidanur', 'Gudibande', 'Manchenahalli', 'Sidlaghatta'],
  'Chikkamagaluru': ['Chikkamagaluru', 'Ajjampura', 'Kadur', 'Kalasa', 'Koppa', 'Mudigere', 'Narasimharajapura', 'Sringeri', 'Tarikere'],
  'Chitradurga': ['Chitradurga', 'Challakere', 'Hiriyur', 'Holalkere', 'Hosadurga', 'Molakalmuru'],
  'Dakshina Kannada': ['Mangaluru', 'Bantwal', 'Belthangady', 'Kadaba', 'Moodabidri', 'Mulki', 'Puttur', 'Sullia', 'Ullal'],
  'Davanagere': ['Davanagere', 'Channagiri', 'Harihar', 'Honnali', 'Jagalur', 'Nyamati'],
  'Dharwad': ['Dharwad', 'Alnavar', 'Annigeri', 'Hubballi', 'Kalghatgi', 'Kundgol', 'Navalgund'],
  'Gadag': ['Gadag-Betageri', 'Gajendragad', 'Lakshmeshwar', 'Mundargi', 'Nargund', 'Ron', 'Shirahatti'],
  'Hassan': ['Hassan', 'Alur', 'Arkalgud', 'Arsikere', 'Belur', 'Channarayapatna', 'Holenarasipura', 'Sakleshpur'],
  'Haveri': ['Haveri', 'Byadgi', 'Hangal', 'Hirekerur', 'Ranebennur', 'Rattihalli', 'Savanur', 'Shiggaon'],
  'Kalaburagi': ['Kalaburagi', 'Afzalpur', 'Aland', 'Chincholi', 'Chittapur', 'Jevargi', 'Kalgi', 'Kamalapur', 'Sedam', 'Shahabad', 'Yadrami'],
  'Kodagu': ['Madikeri', 'Kushalnagar', 'Ponnampet', 'Somwarpet', 'Virajpet'],
  'Kolar': ['Kolar', 'Bangarapet', 'Kolar Gold Fields', 'Malur', 'Mulbagal', 'Srinivaspur'],
  'Koppal': ['Koppal', 'Gangavathi', 'Kanakagiri', 'Karatagi', 'Kushtagi', 'Yelburga'],
  'Mandya': ['Mandya', 'Krishnarajpet', 'Maddur', 'Malavalli', 'Nagamangala', 'Pandavapura', 'Srirangapatna'],
  'Mysuru': ['Mysuru', 'Heggadadevanakote', 'Hunsur', 'Krishnarajanagara', 'Nanjangud', 'Piriyapatna', 'Saragur', 'Tirumakudalu Narasipura'],
  'Raichur': ['Raichur', 'Deodurga', 'Lingsugur', 'Manvi', 'Maski', 'Sindhanur', 'Sirwar'],
  'Ramanagara': ['Ramanagara', 'Channapatna', 'Harohalli', 'Kanakapura', 'Magadi'],
  'Shivamogga': ['Shivamogga', 'Bhadravathi', 'Hosanagara', 'Sagara', 'Shikaripura', 'Soraba', 'Thirthahalli'],
  'Tumakuru': ['Tumakuru', 'Chikkanayakanahalli', 'Gubbi', 'Koratagere', 'Kunigal', 'Madhugiri', 'Pavagada', 'Sira', 'Tiptur', 'Turuvekere'],
  'Udupi': ['Udupi', 'Brahmavara', 'Byndoor', 'Hebri', 'Kapu', 'Karkala', 'Kundapura'],
  'Uttara Kannada': ['Karwar', 'Ankola', 'Bhatkal', 'Dandeli', 'Haliyal', 'Honnavar', 'Joida', 'Kumta', 'Mundgod', 'Siddapur', 'Sirsi', 'Yellapur'],
  'Vijayanagara': ['Hosapete', 'Hagaribommanahalli', 'Harapanahalli', 'Huvina Hadagali', 'Kottur', 'Kudligi'],
  'Vijayapura': ['Vijayapura', 'Babaleshwar', 'Basavana Bagevadi', 'Chadchan', 'Devar Hippargi', 'Indi', 'Kolhar', 'Muddebihal', 'Nidagundi', 'Sindagi', 'Talikoti', 'Tikota'],
  'Yadgir': ['Yadgir', 'Gurmitkal', 'Hunsagi', 'Shahapur', 'Shorapur', 'Wadagera'],
};
