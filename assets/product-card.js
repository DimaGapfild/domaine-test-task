class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.product = this.getProductDataFromJSON(this);

    this.imgHolder = this.querySelector(".js-product-card-img-holder");

    this.priceHolder = this.querySelector(".js-price");
    this.compareAtPriceHolder = this.querySelector(".js-original-price");

    this.productOptions = this.querySelectorAll(
      ".js-product-card-options .swatch"
    );

    this.productOptions?.forEach((item) => {
      item.addEventListener("click", this.handleOptionChange);
    });

    this.saleBadge = this.querySelector(".js-sale-badge");
    this.cardTitle = this.querySelector(".js-product-card-title");

    this.pickedVariant = undefined;
    this.addToCartButton = this.querySelector(".js-add-to-cart");
    this.addToCartButton.addEventListener("click", this.addToCart);
  }

  CENTS_IN_DOLLAR = 100;
  NUMBER_OF_DECIMALS_2 = 2;

  getProductDataFromJSON = (node) => {
    const dataHolder = node.querySelector(`[id^="ProductDataJson"]`);
    return dataHolder && JSON.parse(dataHolder.innerHTML);
  };

  handleOptionChange = (e) => {
    const optionValue = e.target.dataset.optionValue;
    this.pickedVariant = this.getVariantByTitle(optionValue);
    this.setVariantImage(optionValue);
    this.setTitle();
    this.setPrice();
    this.setActiveOption(e.target);
    this.updateVariantId(this.pickedVariant.id);
  };

  getVariantByOptions = (options) =>
    this.variants.find(({ variantOptions }) =>
      isArrayEquals(variantOptions, options)
    );

  setActiveOption(option) {
    this.clearOptionsActiveClass();
    option.classList.add("active");
  }

  clearOptionsActiveClass = () => {
    this.productOptions.forEach((i) => i.classList.remove("active"));
  };

  setVariantImage = (optionName) => {
    const mainImage = this.imgHolder.querySelector(".js-product-card-img");
    const mainImageSrc = this.pickedVariant?.featured_image?.src;
    if (mainImageSrc) {
      mainImage.src = mainImageSrc;
    }
    const secondaryImage = this.imgHolder.querySelector(
      ".js-product-card-secondary-img"
    );
    const secondaryImageName = `${optionName}-secondary`.toLowerCase();
    const secondaryImageSrc = this.product.media.find((item) =>
      item.src.includes(secondaryImageName)
    )?.src;
    if (secondaryImageSrc) {
      secondaryImage.src = secondaryImageSrc;
    }
  };

  setTitle = () => (this.cardTitle.innerHTML = this.pickedVariant.name);

  getVariantByTitle = (optionName) =>
    this.product.variants.find((item) => item.title === optionName);

  setPrice = () => {
    const price = this.pickedVariant.price;
    const compareAtPrice = this.pickedVariant.compare_at_price;
    this.showSaleBadge(compareAtPrice);
    this.showCompareAtPrice(compareAtPrice);
    this.updatePriceColor(compareAtPrice);
    this.priceHolder.innerHTML = `${this.formatPrice(Number(price))}`;
    this.compareAtPriceHolder.innerHTML = compareAtPrice
      ? `${this.formatPrice(Number(compareAtPrice))}`
      : ``;
  };

  formatPrice = (value) => {
    const body = document.querySelector("body");
    const priceTemplate = body.dataset.moneyFormat;
    return priceTemplate.replace(
      `{{amount}}`,
      (value / this.CENTS_IN_DOLLAR).toFixed(this.NUMBER_OF_DECIMALS_2)
    );
  };

  showSaleBadge = (isVisible) => {
    this.saleBadge.style.display = isVisible ? "block" : "none";
  };

  showCompareAtPrice = (isVisible) => {
    this.compareAtPriceHolder.style.display = isVisible ? "block" : "none";
  };

  updatePriceColor = (isPriceHighlighted) => {
    this.priceHolder.classList.remove("text-red-600");
    isPriceHighlighted && this.priceHolder.classList.add("text-red-600");
  };

  removeActiveClassName(arr) {
    arr.forEach((node) => node.classList.remove("active"));
  }

  updateVariantId = (variant) => {
    this.addToCartButton.dataset.variantId = variant;
  }

  addToCart = (e) => {
    e.preventDefault();
    const btn = e.target;
    const variantId = btn.dataset.variantId;
    const data = {
      items: [{ id: variantId, quantity: 1 }],
    };
    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log("variant", variantId);
  }
}

document.querySelector("product-card") &&
  customElements.define("product-card", ProductCard);
