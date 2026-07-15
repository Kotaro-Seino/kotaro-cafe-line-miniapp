window.APP_CONTENT = {
  memberCard: {
    brandLabel: "KOTARO CAFE",
    tier: "ゴールド",
    pointLabel: "会員特典",
    pointValue: "コーヒー無料",
    expiryLabel: "会員有効期限",
    expiryValue: "2027.03.31",
    barcodeHint: "ご注文時にご提示ください"
  },
  flow: [
    {
      title: "LINEから起動",
      description: "トーク、リッチメニュー、またはQRコードから会員ミニアプリを開きます。"
    },
    {
      title: "LINEログインを確認",
      description: "LINEプロフィールを確認し、会員証に表示する基本情報を取得します。"
    },
    {
      title: "会員情報を照合",
      description: "会員番号などを確認して、会員ランクや特典内容の表示準備を行います。"
    },
    {
      title: "会員証を提示",
      description: "店頭で会員証を表示し、コーヒー無料などの特典利用へ自然につなげます。"
    }
  ],
  actions: [
    {
      title: "アメリカンコーヒー",
      description: "すっきり軽やかな飲み口で、はじめての一杯にも選びやすい定番メニューです。",
      tag: "定番人気",
      price: "1000円",
      imageUrl: "https://images.unsplash.com/photo-1580661869408-55ab23f2ca6e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFtZXJpY2FubyUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
      href: "#american-coffee"
    },
    {
      title: "エスプレッソ",
      description: "香りとコクをぎゅっと楽しめる、小さくても満足感のある一杯です。",
      tag: "濃厚",
      price: "1000円",
      imageUrl: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhdHRlJTIwY29mZmVlfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000",
      href: "#espresso"
    },
    {
      title: "カフェラテ",
      description: "やさしいミルク感とまろやかな口当たりで、午後のひと息にぴったりです。",
      tag: "おすすめ",
      price: "1000円",
      imageUrl: "https://images.unsplash.com/photo-1506372023823-741c83b836fe?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGF0dGUlMjBjb2ZmZWV8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
      href: "#cafe-latte"
    },
    {
      title: "ミルク",
      description: "ほっと落ち着くやさしい味わいで、気分をゆるめたいときに合うメニューです。",
      tag: "ほっとする",
      price: "1000円",
      imageUrl: "https://images.unsplash.com/photo-1560460934-1de197883a20?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
      href: "#milk"
    }
  ],
  benefits: [
    "ゴールド会員特典としてお好きなコーヒーを1杯無料でご提供",
    "来店時に会員証を提示するだけで特典確認がスムーズ",
    "その日の気分に合わせておすすめメニューを選びやすい構成"
  ],
  notices: [
    "LIFF ID を設定すると、LINE内でのログイン状態や会員証表示導線を実機に近い形で確認できます。",
    "会員照合の入力UIは独立しているため、後からAPI連携に置き換えやすい構成です。",
    "会員ランク、特典、会員証ラベル、メニュー名、価格、画像URLは content.js を編集するだけで差し替えできます。"
  ],
  memberPrompt: "会員証の表示イメージを確認しやすいよう、確認項目は最小限にしています。実運用ではAPI連携後に会員ランクや特典内容を取得する想定です。"
};
