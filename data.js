const rows=`DE|Delaware|Dover|1787|989948|2489|1949|1|First state to ratify the Constitution.
PA|Pennsylvania|Harrisburg|1787|13002700|46054|44743|17|The Declaration of Independence was signed in Philadelphia.
NJ|New Jersey|Trenton|1787|9288994|8723|7354|12|The most densely populated state.
GA|Georgia|Atlanta|1788|10711908|59425|57513|14|Georgia is the Peach State.
CT|Connecticut|Hartford|1788|3605944|5543|4842|5|Noah Webster published his American dictionary here.
MA|Massachusetts|Boston|1788|7029917|10565|7800|9|The Boston Tea Party happened here.
MD|Maryland|Annapolis|1788|6177224|12406|9707|8|Famous for blue crabs from Chesapeake Bay.
SC|South Carolina|Columbia|1788|5118425|32020|30061|7|Fort Sumter is in Charleston Harbor.
NH|New Hampshire|Concord|1788|1377529|9349|8953|2|Its motto is Live Free or Die.
VA|Virginia|Richmond|1788|8631393|42775|39490|11|Eight U.S. presidents were born here.
NY|New York|Albany|1788|20201249|54555|47126|26|The Statue of Liberty stands in New York Harbor.
NC|North Carolina|Raleigh|1789|10439388|53819|48618|14|The Wright brothers flew near Kitty Hawk.
RI|Rhode Island|Providence|1790|1097379|1545|1034|2|The smallest state by area.
VT|Vermont|Montpelier|1791|643077|9616|9217|1|Famous for maple syrup.
KY|Kentucky|Frankfort|1792|4505836|40408|39486|6|Mammoth Cave is the longest known cave system.
TN|Tennessee|Nashville|1796|6910840|42144|41235|9|Nashville is known as Music City.
OH|Ohio|Columbus|1803|11799448|44826|40861|15|The Wright brothers grew up in Dayton.
LA|Louisiana|Baton Rouge|1812|4657757|52378|43204|6|New Orleans is famous for Mardi Gras.
IN|Indiana|Indianapolis|1816|6785528|36420|35826|9|Hosts the Indianapolis 500.
MS|Mississippi|Jackson|1817|2961279|48432|46923|4|Named for the Mississippi River.
IL|Illinois|Springfield|1818|12812508|57914|55519|17|Chicago is famous for skyscrapers.
AL|Alabama|Montgomery|1819|5024279|52420|50645|7|Montgomery played a major role in the civil rights movement.
ME|Maine|Augusta|1820|1362359|35380|30843|2|Famous for rocky coastline and lobster.
MO|Missouri|Jefferson City|1821|6154913|69707|68742|8|The Gateway Arch is in St. Louis.
AR|Arkansas|Little Rock|1836|3011524|53179|52035|4|You can search for diamonds at Crater of Diamonds State Park.
MI|Michigan|Lansing|1837|10077331|96714|56539|13|Touches four of the five Great Lakes.
FL|Florida|Tallahassee|1845|21538187|65758|53625|28|The Everglades have alligators and crocodiles.
TX|Texas|Austin|1845|29145505|268596|261232|38|Texas was once an independent republic.
IA|Iowa|Des Moines|1846|3190369|56273|55857|4|Famous for cornfields.
WI|Wisconsin|Madison|1848|5893718|65496|54158|8|Famous for cheese and dairy farms.
CA|California|Sacramento|1850|39538223|163695|155779|52|Coast redwoods are the tallest living trees.
MN|Minnesota|Saint Paul|1858|5706494|86936|79627|8|Known as the Land of 10,000 Lakes.
OR|Oregon|Salem|1859|4237256|98379|95988|6|Crater Lake is the deepest U.S. lake.
KS|Kansas|Topeka|1861|2937880|82278|81759|4|Known for vast wheat fields.
WV|West Virginia|Charleston|1863|1793716|24230|24038|2|Became a state during the Civil War.
NV|Nevada|Carson City|1864|3104614|110572|109781|4|Las Vegas is famous for bright lights.
NE|Nebraska|Lincoln|1867|1961504|77348|76824|3|Home to the vast Sandhills grassland.
CO|Colorado|Denver|1876|5773714|104094|103642|8|Joined 100 years after independence.
ND|North Dakota|Bismarck|1889|779094|70698|69001|1|Home to Theodore Roosevelt National Park.
SD|South Dakota|Pierre|1889|886667|77116|75811|1|Mount Rushmore is here.
MT|Montana|Helena|1889|1084225|147040|145546|2|Nicknamed Big Sky Country.
WA|Washington|Olympia|1889|7705281|71298|66456|10|Mount Rainier is an active volcano.
ID|Idaho|Boise|1890|1839106|83569|82643|2|Known for potatoes and the Sawtooth Mountains.
WY|Wyoming|Cheyenne|1890|576851|97813|97093|1|Most of Yellowstone National Park is here.
UT|Utah|Salt Lake City|1896|3271616|84897|82170|4|Home to the Great Salt Lake.
OK|Oklahoma|Oklahoma City|1907|3959353|69899|68595|5|Part of Tornado Alley.
NM|New Mexico|Santa Fe|1912|2117522|121590|121298|3|Santa Fe is one of the oldest state capitals.
AZ|Arizona|Phoenix|1912|7151502|113990|113594|9|The Grand Canyon is here.
AK|Alaska|Juneau|1959|733391|665384|570641|1|The largest state by area.
HI|Hawaii|Honolulu|1959|1455271|10932|6423|2|The only state made entirely of islands.`;
const states=rows.split('\n').map(r=>{let a=r.split('|');return {code:a[0],name:a[1],capital:a[2],year:+a[3],pop:+a[4],area:+a[5],land:+a[6],house:+a[7],fact:a[8]}});
const elections={
1976:'AL AR DE FL GA HI KY LA MD MA MN MS MO NY NC OH PA RI SC TN TX WV WI',
1980:'GA HI MD MN RI WV',1984:'MN',1988:'HI IA MA MN NY OR RI WA WV WI',
1992:'AR CA CO CT DE GA HI IL IA KY LA ME MD MA MI MN MO MT NV NH NJ NM NY OH OR PA RI TN VT WA WV WI',
1996:'AR AZ CA CT DE FL HI IL IA KY LA ME MD MA MI MN MO NV NH NJ NM NY OH OR PA RI TN VT WA WV WI',
2000:'CA CT DE HI IL IA ME MD MA MI MN NJ NM NY OR PA RI VT WA WI',
2004:'CA CT DE HI IL ME MD MA MI MN NH NJ NY OR PA RI VT WA WI',
2008:'CA CO CT DE FL HI IL IN IA ME MD MA MI MN NV NH NJ NM NY NC OH OR PA RI VT VA WA WI',
2012:'CA CO CT DE FL HI IL IA ME MD MA MI MN NV NH NJ NM NY OH OR PA RI VT VA WA WI',
2016:'CA CO CT DE HI IL ME MD MA MN NV NH NJ NM NY OR RI VT VA WA',
2020:'AZ CA CO CT DE GA HI IL ME MD MA MI MN NV NH NJ NM NY OR PA RI VT VA WA WI',
2024:'CA CO CT DE HI IL ME MD MA MN NH NJ NM NY OR RI VT VA WA'};
