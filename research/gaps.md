# Data gaps & assumptions (please review)

1. **Size options are not captured.** Foodpanda shows "from" prices, but the restaurant was closed during the scrape, so the size picker would not open. The site sells every item at its regular ("from") price and says so on the menu page.
2. **Foodpanda deal prices ignored.** Detox and protein shakes showed a 10% app deal (e.g. Rs 612 instead of Rs 680). The site uses the regular price.
3. **Menu = Model Town Foodpanda listing.** Other branches may differ. Seasonal juices from Instagram (white pomegranate, cherry, lychee, jamun, watermelon, plum smoothie) are shown only as posters in the "season" strip, with no price and no cart button.
4. **Hero drink 2** uses the "White n Red Pomegranate" poster, but its cart button adds *Red Pomegranate Juice* (Rs 1,250), the only pomegranate item on Foodpanda.
5. **Names tidied:** BULK-UP SHAKE becomes Bulk-Up Shake, Fruit Cocktell becomes Fruit Cocktail Juice, Musami (Fresh) becomes Fresh Musami, and so on. The original Foodpanda name is kept in `fpName`. Descriptions that were filler or wrong (e.g. the Pineapple Juice text says "apple juice") were dropped, not rewritten.
6. **Branch phones:** taken from the latest IG captions (Oct 2026). Google lists a different number for Gulberg (+92 343 0521357) and none for the DHA branches.
7. **Hours** come from Google Maps. The DHA Phase 1 listing is titled "Health & Goodness" and DHA Phase 2 is categorised "Bar", but their locations match the IG branch names.
8. **Logo:** only a 200 px bevelled raster exists (FB profile). It is used small in the header and footer. A vector redraw would be needed for large use.
9. **Product photos on the menu** are the brand's own Foodpanda uploads. Several look like stock photography, but they are what HnG publishes for these items.
10. **Not verified:** founding year (About shows "On Facebook since 2015", the page creation date, not a founding year), delivery radius, delivery fee and taxes (checkout says the branch confirms them).
11. **Hero carousel** shows six drinks. Lychee is seasonal and only on Instagram, so its label links to the branch finder instead of adding to the cart. Mango uses the three-cup "Taste the Sweetness of Mango" poster, and its cart button adds *Mango Juice* (Rs 650).
12. **Backdrops** for each drink are CSS recreations of the colour, light and floor of that drink's Instagram poster. No poster backgrounds were reused directly, because they carry text.
13. **New cut-outs** (round 2): Falsa (chroma-keyed off its teal poster), Mango ×3, Lychee, Jamun, Red Retreat and Green Clean. All are from official IG posts and are listed in `research/scripts/cutout2.py` and `cutout3.py`.
