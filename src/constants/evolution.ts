export interface EvolutionNode {
  id: string;
  name: string;
  nameEn: string;
  stageName: string;
  spriteKey: string;
  description: string;
  careTip: string;
  condition: string;
}

export const EVOLUTION_GUIDE: EvolutionNode[] = [
  {
    id: 'EGG',
    name: '神秘蛋',
    nameEn: 'Tamagotch Egg',
    stageName: '蛋期',
    spriteKey: 'egg1',
    description: '來自拓麻歌子星的神秘蛋，隨時準備破殼而出。',
    careTip: '請靜待數秒～一分鐘，觀察蛋體搖晃即可誕生！',
    condition: '剛開始遊戲',
  },
  {
    id: 'BABYTCHI',
    name: '嬰兒雞 (Babytchi)',
    nameEn: 'Babytchi',
    stageName: '嬰兒期 (0歲)',
    spriteKey: 'baby1',
    description: '剛孵化的小生命，極度脆弱，代謝極快，常常飢餓與便便。',
    careTip: '隨時注意呼叫指示燈，保持飽食度與整潔。',
    condition: '蛋孵化後 (約 10~60 秒)',
  },
  {
    id: 'MARUTCHI',
    name: '圓滾幼童 (Marutchi)',
    nameEn: 'Marutchi',
    stageName: '幼童期 (1~2歲)',
    spriteKey: 'child1',
    description: '圓滾滾的小身軀，好奇心旺盛，開始懂得知恩與胡鬧。',
    careTip: '當他在滿腹時胡亂呼叫，記得按下「管教⚡」按鈕訓話！',
    condition: '嬰兒期存活滿 1 分鐘進化',
  },
  {
    id: 'TAMATCHI',
    name: '淘氣少年 (Tamatchi)',
    nameEn: 'Tamatchi',
    stageName: '青春期 (3~4歲)',
    spriteKey: 'teen1',
    description: '長出小手與小腳的少年，個性活潑，愛玩猜左右遊戲。',
    careTip: '多與他玩猜拳小遊戲保持心情愉快並控制體重。',
    condition: '幼兒期悉心照顧至 3 歲進化',
  },
  {
    id: 'MAMETCHI',
    name: '豆豆兔 (Mametchi)',
    nameEn: 'Mametchi (Smart Bun)',
    stageName: '成年期 (完美型)',
    spriteKey: 'mametchi1',
    description: '智商高達 250 的天才兔！1996 年最受歡迎的最高榮譽電子雞。',
    careTip: '管教度高達 75% 以上、從未疏忽便便與飢餓方可養成。',
    condition: '紀律 ≥ 75%，失誤 ≤ 1 次',
  },
  {
    id: 'GINJIROTCHI',
    name: '銀次郎企鵝 (Ginjirotchi)',
    nameEn: 'Ginjirotchi (Penguin)',
    stageName: '成年期 (活潑型)',
    spriteKey: 'ginjirotchi1',
    description: '熱情正直的企鵝紳士，擅長各類體育活動。',
    careTip: '經常玩猜左右遊戲，維持體重在健康範圍。',
    condition: '紀律 50% ~ 74%，健康狀態良好',
  },
  {
    id: 'KUCHIPATCHI',
    name: '長嘴鴨 (Kuchipatchi)',
    nameEn: 'Kuchipatchi (Cute Duck)',
    stageName: '成年期 (悠閒型)',
    spriteKey: 'kuchipatchi1',
    description: '擁有可愛大嘴巴的天然呆，食量驚人，最喜歡吃點心睡大覺。',
    careTip: '偶爾忘記管教，隨性餵食點心即可養出親切長嘴鴨。',
    condition: '紀律 25% ~ 49%，體重較重',
  },
  {
    id: 'MASKTCHI',
    name: '蒙面忍者 (Masktchi)',
    nameEn: 'Masktchi (Masked Ninja)',
    stageName: '成年期 (自立型)',
    spriteKey: 'masktchi1',
    description: '戴著神祕面具的忍者，個性孤傲內向，但其實很忠誠。',
    careTip: '管教較少，疏忽次數稍多時容易轉變為此型態。',
    condition: '紀律 < 25%，疏忽次數較多',
  },
  {
    id: 'OYAJITCHI',
    name: '親父大叔雞 (Oyajitchi)',
    nameEn: 'Oyajitchi (Secret Uncle)',
    stageName: '成年期 (隱藏稀有型)',
    spriteKey: 'oyajitchi1',
    description: '頭戴扁帽的大叔！長出雙腿會喝小酒，是傳說級的超彩蛋角色。',
    careTip: '讓 Masktchi 達到 100% 訓話並存活至高齡，或在特定條件下蛻變！',
    condition: '特殊秘密條件（長壽高齡或極限管教）',
  },
];
