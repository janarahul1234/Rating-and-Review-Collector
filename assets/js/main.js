const getElement = (selector) => document.querySelector(selector);

const username = getElement("#username");
const review = getElement("#review");
const placeholderText = getElement("#placeholder-text");
const toolbar = getElement("#toolbar");
const buttonSubmit = getElement("#btn-submit");
const reviewsCount = getElement("#reviews-count");
const reviewsContainer = getElement("#reviews-container");
const buttonSortReviews = getElement("#btn-sort");
const rating = getElement("#rating");
const ratingStars = getElement("#rating-stars");
const averageRating = getElement("#average-rating");
const averageRatingStars = getElement("#average-rating-stars");
const ratingStats = getElement("#rating-stats");

const DEFAULT_STARS = 5;

let reviews = [
  {
    id: 1,
    username: "Aarav Sharma",
    review:
      "This review collector is amazing! The UI is smooth, and I love the formatting options.",
    timestamp: 1739942508687,
    rating: 4,
  },
  {
    id: 2,
    username: "Priya Verma",
    review:
      "A simple and efficient tool for collecting feedback. Makes the process hassle-free!",
    timestamp: 1739942105687,
    rating: 3,
  },
  {
    id: 3,
    username: "Rohan Iyer",
    review:
      "User-friendly design and seamless functionality. Highly recommended for <b>businesses!</b>",
    timestamp: 1739941804687,
    rating: 5,
  },
];

const getTotalRating = () => {
  return reviews.reduce((acc, review) => review.rating + acc, 0);
};

const getAverageRating = () => {
  return Math.round(getTotalRating() / reviews.length);
};

const getRatingStats = () => {
  const ratingStats = Array(DEFAULT_STARS).fill(0);
  const totalReviews = reviews.length;

  reviews.forEach(({ rating }) => {
    ratingStats[rating - 1]++;
  });

  return ratingStats
    .map((count, index) => [index + 1, count, ((count / totalReviews) * 100).toFixed()])
    .sort((a, b) => a[1] - b[1]);
};

let currentSort = 0;
const sortingOptions = ["Most recent", "Oldest"];

const updatePlaceholderVisibility = () => {
  const isEmpty = review.textContent.trim().length === 0;
  placeholderText.classList.toggle("hidden", !isEmpty);
};

review.addEventListener("input", updatePlaceholderVisibility);

[...toolbar.children].forEach((btn) =>
  btn.addEventListener("click", () =>
    document.execCommand(btn.dataset.command, false, null)
  )
);

[...ratingStars.children].forEach((star, index, stars) => {
  star.addEventListener("click", () => {
    const clickIndex = index + 1;
    rating.innerText = clickIndex;

    stars.forEach((s, i) => {
      s.innerHTML = `<i class="ri-star-fill ${
        i < clickIndex ? "text-amber-500" : "text-gray-300"
      }"></i>`;
    });
  });
});

buttonSortReviews.addEventListener("click", () => {
  currentSort = currentSort === sortingOptions.length - 1 ? 0 : currentSort + 1;
  buttonSortReviews.innerHTML = `<i class="ri-arrow-up-down-line"></i> ${sortingOptions[currentSort]}`;
  renderReviews();
});

const ratingElement = (stars) => {
  return [...Array(DEFAULT_STARS)]
    .map(
      (_, i) =>
        `<i class="ri-star-fill ${
          i < stars ? "text-amber-500" : "text-gray-300"
        }"></i>`
    )
    .join("");
};

const reviewElement = ({ username, review, timestamp, rating }) => {
  const formatedTimestamp = formatTimestamp(timestamp);
  const element = document.createElement("div");
  element.innerHTML = `
    <h3 class="text-sm mb-1">
      <span class="font-semibold">${username}</span> • ${formatedTimestamp}
    </h3>
    <div class="flex items-center gap-1.5 mb-[2px]">
      <span class="text-2xl">${rating}</span>
      <span class="flex gap-1">${ratingElement(rating)}</span>
    </div>
    <p class="text-gray-950 mb-2">${review}</p>
  `;
  return element;
};

const renderRatingStats = () => {
  const sortedRatingStats = getRatingStats();

  ratingStats.innerHTML = `
    <div class="flex flex-col items-center">
      <div class="relative mb-2">
        <div
          class="relative w-[72px] h-[72px] bg-red-100 rounded-full before:absolute before:inset-1/2 before:-translate-1/2 before:w-[calc(100%-8px)] before:h-[calc(100%-8px)] before:bg-white before:rounded-full before:z-1 after:absolute after:inset-1/2 after:-translate-1/2 after:w-full after:h-full after:bg-conic after:from-red-500 after:to-red-100 after:from-${sortedRatingStats.at(-3)[2]}% after:to-0% after:rounded-full">
        </div>
        <div class="absolute inset-0 flex items-center justify-center z-1">
          <span class="text-xl flex items-center gap-[2px]">
            <i class="ri-star-fill text-red-500"></i>
            <span class="text-gray-950">${sortedRatingStats.at(-3)[0]}</span>
          </span>
        </div>
      </div>
      <span class="text-sm flex items-center gap-[2px]">
        <i class="ri-user-line"></i> ${sortedRatingStats.at(-3)[1]}
      </span>
    </div>

    <div class="flex flex-col items-center">
      <div class="relative mb-2">
        <div
          class="w-[88px] h-[88px] bg-green-100 rounded-full before:absolute before:inset-1/2 before:-translate-1/2 before:w-[calc(100%-8px)] before:h-[calc(100%-8px)] before:bg-white before:rounded-full before:z-1 after:absolute after:inset-1/2 after:-translate-1/2 after:w-full after:h-full after:bg-conic after:from-green-500 after:to-green-100 after:from-${sortedRatingStats.at(-1)[2]}% after:to-0% after:rounded-full">
        </div>
        <div class="absolute inset-0 flex items-center justify-center z-1">
          <span class="text-xl flex items-center gap-[2px]">
            <i class="ri-star-fill text-green-500"></i>
            <span class="text-gray-950">${sortedRatingStats.at(-1)[0]}</span>
          </span>
        </div>
      </div>
      <span class="text-sm flex items-center gap-[2px]">
        <i class="ri-user-line"></i> ${sortedRatingStats.at(-1)[1]}
      </span>
    </div>

    <div class="flex flex-col items-center">
      <div class="relative mb-2">
        <div
          class="w-[72px] h-[72px] bg-amber-100 rounded-full before:absolute before:inset-1/2 before:-translate-1/2 before:w-[calc(100%-8px)] before:h-[calc(100%-8px)] before:bg-white before:rounded-full before:z-1 after:absolute after:inset-1/2 after:-translate-1/2 after:w-full after:h-full after:bg-conic after:from-amber-500 after:to-amber-100 after:from-${sortedRatingStats.at(-2)[2]}% after:to-0% after:rounded-full">
        </div>
        <div class="absolute inset-0 flex items-center justify-center z-1">
          <span class="text-xl flex items-center gap-[2px]">
            <i class="ri-star-fill text-amber-500"></i>
            <span class="text-gray-950">${sortedRatingStats.at(-2)[0]}</span>
          </span>
        </div>
      </div>
      <span class="text-sm flex items-center gap-[2px]">
        <i class="ri-user-line"></i> ${sortedRatingStats.at(-2)[1]}
      </span>
    </div>
  `;
};

const renderReviews = () => {
  averageRating.innerText = getAverageRating();
  averageRatingStars.innerHTML = ratingElement(getAverageRating());

  reviewsCount.innerText = reviews.length;
  reviewsContainer.innerHTML = "";

  renderRatingStats();

  const sortingMethods = [
    () => sortByField(reviews, "id", "desc"), // Most recent
    () => sortByField(reviews, "id", "asc"), // Oldest
  ];

  sortingMethods[currentSort]().forEach((review) => {
    reviewsContainer.appendChild(reviewElement(review));
  });
};

function sortByField(array, field, order = "asc") {
  return [...array].sort((a, b) =>
    order === "asc" ? a[field] - b[field] : b[field] - a[field]
  );
}

const formatTimestamp = (timestamp) => {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 1) return "now";
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

buttonSubmit.addEventListener("click", () => {
  if (
    !username.value.trim() ||
    !review.innerHTML.trim() ||
    Number(rating.innerText) === 0
  )
    return;

  reviews.push({
    id: reviews.length + 1,
    username: username.value,
    review: review.innerHTML,
    timestamp: Date.now(),
    rating: Number(rating.innerText),
  });

  renderReviews();
  username.value = "";
  review.innerHTML = "";
  rating.innerText = 0;
  [...ratingStars.children].forEach((star) => {
    star.innerHTML = `<i class="ri-star-fill text-gray-300"></i>`;
  });
  updatePlaceholderVisibility();
});

renderReviews();
