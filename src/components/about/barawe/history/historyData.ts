export type IconKey = 'books' | 'sail' | 'feather' | 'users' | 'history';

export type HistoryEntry = {
  id: string;
  title: string;
  summary: string;
  body: string;
  icon: IconKey;
  source?: {
    label: string;
    href: string;
  };
};

const historyData: HistoryEntry[] = [
  {
    id: 'early',
    title: 'Early City & Swahili World',
    summary:
      'How Baraawe grew from a small Tunni settlement into a busy Swahili port-city shaped by trade, Islam, and the Chimiini language.',
    body: `Early City (11th–15th Century)

A Coastal Gem is Born

Baraawe began as a small settlement around the 9th–10th century, founded by Aw-Ali of the Tunni clan. Its location along the Somali coast between red dunes, white sands and the Indian ocean made it perfectly placed for cultural and trade exchanges between foreign traders and the bravanese people. What once began as a community of farmers grew into a coastal town by the 12th century. During this time, locals developed Chimiini, blending Swahili and Tunni dialects that would become one of Baraawe’s most defining cultural features.

Image: public/assets/about-map.jpg

A Busy Port of the Indian Ocean

Baraawe wasn’t just another coastal town — it became an active stop along the Indian Ocean trade routes. Traders from Arabia, Persia, and India, travelled to Baraawes costlines to exchange luxury goods such as ceramics, textiles, and spices for ivory, fish, skins, and fragrant woods. A 14th-century Yemeni visitor described Baraawe as “a small locality … with an anchorage sought by boats from India and from each small city of the Sawāḥil.” Interestingly even Chinese records from the time of Admiral Zheng He mention the city, proving that Baraawe was known far beyond East Africa. The markets would have been filled with different languages, scents and goods, making the city a vibrant, multicultural meeting point long before modern times.

Image: public/assets/about-coast.png

Faith, Culture, and Coral-Stone Streets

Islam shaped Baraawe from its earliest days. Traders and settlers from Yemen and Syria brought their knowledge, skills and architectural styles, leaving their mark on the city. Baraawes unique coastal look is shown through the coral-stone houses and mosques that lined the alleys of Mpayi, the city’s oldest quarter. The scholar Ibn Saʿīd described it as “an Islamic Island on the Somali coast.” A perfect description for a town known for its education and faith. By the 15th century the city was flourishing with conversation and action — scholars sharing ideas, merchants calling out prices, and ships carrying news and ideas from across the sea.

Image: public/assets/about-lighthouse.jpg`,
    icon: 'sail',
  },

  {
    id: 'republic',
    title: 'Republic & Trade',
    summary:
      'How Baraawe developed into a self-governing trading republic, guided by elders and sustained through Indian Ocean commerce.',
    body: `Republic & Trade (16th–18th Century)

A City Governed by Its People

By the 16th century, Baraawe had developed into a confident and well-organised trading republic. Instead of being ruled by a single leader, the city was guided by a Council of Elders who understood both community life and regional trade. They settled disputes, supported social order, and ensured that Baraawe’s harbour remained open and welcoming to travellers.

Their influence came not from military power, but from their ability to maintain balance and stability during a period of change across the coast. Locals often describe this time as one when “the city’s strength was its people, not its walls,” reflecting how decisions were made collectively and how neighbourhoods had a voice in the city’s future.

Trade Across the Indian Ocean

Trade continued to define Baraawe’s identity. Merchants from Arabia, India, Persia, and the wider Swahili Coast visited the port regularly, exchanging textiles, spices, grains, and crafted goods. These interactions connected Baraawe to major trade networks across the Indian Ocean and added to the city’s cultural diversity.

A traveller arriving by dhow might hear several languages before reaching the main market yet still feel welcomed. This mixture of cultures shaped Baraawe’s crafts, poetry, architecture, and cuisine.

Image: public/assets/sail-boat-baraawe-about.jpg

Dhow, symbolising trade routes.

Resilience and Independence

Foreign pressure grew during this period. In 1506, Portuguese forces attempted to take control of trade routes along the East African coast. Their attack on Baraawe caused disruption, but the city rebuilt quickly and returned to its trading activity.

After this event, Baraawe focused even more on protecting its economic independence — managing its own markets, negotiating trade on its own terms, and relying on strong trader networks rather than foreign powers.

By the 18th century, Baraawe remained a respected coastal hub. Its local governance, active port, and long-standing trade relationships supported a steady, self-sustaining economy. Trade brought wealth, but independence brought dignity and unity — and that balance allowed Baraawe to thrive for generations.`,
    icon: 'sail',
  },

  {
    id: 'scholars',
    title: 'Scholars & Language',
    summary:
      'How Chimiini became a marker of identity, and how Baraawe emerged as a centre of scholarship, poetry, and Sufi learning.',
    body: `Scholars & Language (18th–19th Century)

Chimiini: A Language of Identity

Baraawe is known for its language Chimiini, a unique dialect that blends Arabic, Somali and local Tunni influences. By the 18th century, it became a core piece of the city’s identity — spoken in homes, mosques, schools and markets. Chimiini helped to carry poetry, stories and religious texts, linking daily life with scholarly tradition and making learning accessible for locals. Many visitors and traders along the Swahili coast noted its richness and melodic pattern, setting Baraawe apart from other coastal towns where Arabic dominated teachings.

Image: public/assets/arabic-text-about.jpg

A Hub of Scholarship and Poetry

During this time, Baraawe was a major centre of Islamic learning and Sufism. Scholars and poets travelled from across the Horn of Africa and the Swahili coast to study and teach Islamic teachings, creating a system where knowledge was beautifully exchanged. They taught in mosques and private study circles, where students learned mathematics, poetry, and theology.

Two well-known and respected figures surfaced during this time:

Image: public/assets/uways-sufi-about.jpg

Uways al-Barawi — a Sufi scholar whose teachings influenced spirituality across the Horn of Africa and Somalia.

Image: public/assets/dada-poet-about.jpg

Dada Masiti — a poet remembered for her deeply spiritual and social works in Chimiini.

Sufism and Community Life

Sufism shaped both spiritual and cultural life. Sufi orders (‘turuq’) hosted gatherings where scholars and community members shared religious teachings, moral guidance, and ritual. These gatherings strengthened community bonds and linked Baraawe to wider networks of Islamic thought across the Indian Ocean. This helped strengthen Baraawe’s reputation as a spiritual and academic hub that influenced neighbouring towns and traders, including those from Oman and Zanzibar.

Chimiini Today

Although fewer people speak Chimiini in Baraawe itself, the Bravanese diaspora has become crucial in preserving it. The city’s legacy is still seen in its mosques, libraries and local traditions. Cultural groups and community organisations record poetry, oral history and religious texts, ensuring that the language and its rich academic heritage survive for future generations.`,
    icon: 'feather',
  },

  {
    id: 'invasions',
    title: 'Invasions Through the Years',
    summary:
      'How Baraawe’s strategic position exposed it to foreign attacks, shifting powers, and modern conflict across the centuries.',
    body: `Invasions Through the Years

A Strategic Port, A Repeated Target

Baraawe’s position on the Indian Ocean made it an important coastal town, but it also exposed the city to groups seeking control over its harbour and trade routes. Across the centuries, Baraawe faced invasions and changes in power that disrupted daily life and tested the strength of its people.

The Portuguese Attack (1506)

One of the earliest major assaults came in the early 1500s, when Portuguese forces attempted to dominate trade routes along the East African coast. This event, known as the Battle of Barawa, saw a large fleet led by Tristão da Cunha attack the city. Fighting took place, parts of the town were burned, and many residents fled temporarily for safety. The Portuguese withdrew soon after and did not remain in control.

Although the attack caused significant disruption, Baraawe rebuilt quickly and reopened its port. This early recovery became a defining pattern in the city’s history, showing how strong and organised the community was even in times of crisis.

Image: public/assets/fleet-attack-baraawe-about.jpg

An illustration of the fleet involved in the 1506 attack.

Regional Shifts and Changing Powers

As time passed, regional political structures changed. The decline of the Ajuran Sultanate, which once controlled much of southern Somalia and its trade routes, brought new influences to the region. While these changes affected the wider area, everyday life in Baraawe continued to be guided by its own local traditions and social organisation.

Image: public/assets/portugues-map-mogadishu-about.png

1576 Portuguese map of the Mogadishu area.

Colonial Rule

A major shift occurred in the late 19th century when Italy established colonial control over southern Somalia. Local leadership systems were limited, new laws were introduced, and trade was redirected to serve colonial interests. Despite these pressures, Baraawe’s cultural and religious life continued, supported by strong community networks.

Image: public/assets/italian-south-about.jpg

Italian colonial presence in southern Somalia.

Civil War and Modern Conflict

The outbreak of civil war in the 1990s brought another prolonged period of instability. Control of Baraawe changed hands multiple times, public services weakened, and many families were displaced. In the 2000s, Islamist groups also gained influence due to the city’s strategic location, creating further challenges for residents.

Despite these hardships, Baraawe consistently found ways to endure. Community ties, cultural traditions, and support from the diaspora helped preserve identity and continuity. Today, the city is gradually recovering and reconnecting with its long history as a resilient coastal town.

Image: public/assets/after-civil-war-about.png

Image to reflect the aftermath of conflict during the civil war.`,
    icon: 'history',
  },

  {
    id: 'lineages',
    title: 'Lineages & Local Ties',
    summary:
      'How Baraawe’s major communities blended through marriage, trade, faith, and daily life — forming a unified Bravanese identity.',
    body: `Lineages & Local Ties (18th–20th Century)

Communities of Baraawe

Baraawe’s identity has long been shaped by a handful of key communities: the Tunni, Hatimi, Ashraf, and Biido.  
The Tunni were among the earliest settlers, laying the foundations for architecture and trade. The Hatimi and Ashraf — families of Arab descent — were associated with religious knowledge and leadership, shaping the city’s Islamic institutions. The Biido were skilled merchants and artisans, strengthening commerce and maritime ties along the coast.

Each community played a unique role, but it was their relationships that made Baraawe resilient. Social spaces were shared, and families often married across lineages, building strong networks of unity.

Intermarriage and Social Harmony

Unlike many coastal towns where divisions caused conflict, Baraawe developed a culture of balance. Intermarriage strengthened alliances in trade, governance, and religious leadership. Elders resolved disputes through councils where each lineage was represented — ensuring fairness and stability.

Cultural Legacy and Daily Life

The blending of lineages shaped language, customs and clothing. Chimiini reflects this mix: African, Arab and Tunni influences woven into one dialect and poetic tradition. Shared religious festivals, Sufi gatherings, and Quranic schools brought people together regardless of lineage.

Image: public/assets/kofi-about.jpg

The *Kofi Baraawe* — a distinct Bravanese hat — remains a symbol of cultural identity, traditionally worn by Somali elders.

Daily life reflected this shared culture. Weddings, markets, poetry gatherings and holidays blended customs from all communities.

A reminder that cooperation and inclusivity will always define Baraawe.`,
    icon: 'users',
  },

  {
    id: 'recent',
    title: 'Recent History',
    summary:
      'From colonial rule to civil war, diaspora, and modern rebuilding — the story of Baraawe in the 19th–21st centuries.',
    body: `Recent History (19th–21st Century)

Italian Rule (Late 1800s–1940s)

In the late 19th century, Baraawe was placed under Italian colonial authority as part of Italian Somaliland. The Italians introduced new laws and attempted to redirect trade toward larger regional towns, yet Baraawe maintained its distinctive identity. Families continued living in coral-stone houses, speaking Chimiini in the streets, and gathering for lessons and prayers in local mosques. Stories passed down through Bravanese families recall this as a challenging era, yet one in which daily traditions — fishing, markets, Quranic learning — remained resilient.

War and the Diaspora (1990s–2000s)

When Somalia’s civil war broke out in the early 1990s, Baraawe suffered deeply. Control shifted constantly, businesses closed, and many families fled. Some relocated to other parts of Somalia or Kenya, while others journeyed further — to the UK, USA, the Middle East, and beyond.  
This created a wide and active diaspora that carried Chimiini, memories, and cultural identity abroad. As many elders recall: “We left with nothing but our stories.”

During these years the city struggled, and many cultural landmarks and archives were lost. For a long time, Baraawe lived more in memory than in physical place.

The Return of Stability (2014–Present)

From around 2014 onward, Baraawe slowly regained stability. Security improved, markets reopened, and many families felt safe enough to return. The city served as the capital of the Southwest State for several years, bringing administration and renewed activity.

Today, Baraawe is rebuilding — physically, socially, and culturally. The determination of its people stands out, both within the city and across its diaspora.

Diaspora and Community Projects

The diaspora plays a key role in the city’s recovery. Families abroad fund schools, wells, health clinics, and women’s groups. Youth-led initiatives preserve Chimiini, archive old photos, and record traditional songs — keeping heritage alive.

These efforts show a community committed to restoring education, culture and local institutions after decades of hardship.

Image: public/assets/logo-human-rights-about.jpg`,
    icon: 'books',
  },
];

export default historyData;
