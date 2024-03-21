export const redirectCasinoParams = (
  filteredCasinoUrl,
  { NextResponse, language, req }
) => {
  return NextResponse.redirect(
    new URL(`/${language}/${filteredCasinoUrl?.redirect}`, req.url)
  );
};

export const redirectCasinoUrls = [
  { url: "casino-cashier", redirect: "/settings/deposit" },
  { url: "casino-lobby", redirect: "/casino" },
  { url: "casino-return-when-close-game", redirect: "/casino" },
  { url: "casino-game-history", redirect: "/settings/transaction_history" },
  { url: "casino-deposit", redirect: "/settings/deposit" },
];
