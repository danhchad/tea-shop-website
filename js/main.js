import { partnerLogos, productList, partnerLogoBasePath } from "./data.js";

/* ================ 
    Nav
  =================== */
document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     1. LOGIC ẨN/HIỆN NAVBAR KHI CUỘN (Thay thế .hidescroll())
     ========================================= */
  const navbar = document.querySelector(".navbar");
  let lastScrollTop = 0;

  if (navbar) {
    // Thêm hiệu ứng trượt mượt mà bằng JS (nếu CSS chưa có)
    navbar.style.transition = "top 0.3s ease-in-out";

    window.addEventListener("scroll", () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Logic: Cuộn xuống > 50px thì ẩn, Cuộn lên thì hiện
      if (scrollTop > lastScrollTop && scrollTop > 50) {
        navbar.style.top = "-100px"; // Kéo navbar lên trên để ẩn (giả sử navbar cao < 100px)
      } else {
        navbar.style.top = "0"; // Kéo về vị trí cũ
      }

      // Cập nhật vị trí cuộn để so sánh cho lần sau
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  /* =========================================
     2. MOBILE DROPDOWN MENU (Thay thế toggle logic)
     ========================================= */
  const toggleBtn = document.querySelector("#toggle_btn");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  // Kiểm tra nếu nút và menu tồn tại thì mới chạy (tránh lỗi)
  if (toggleBtn && dropdownMenu) {
    toggleBtn.addEventListener("click", () => {
      // Tự động thêm/xóa class "open"
      dropdownMenu.classList.toggle("open");
    });
  }
});

/* ================ 
    Partner Logos
  =================== */
// Thay $(function()...) bằng sự kiện DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("partner-logo-list");

  // Kiểm tra an toàn: Chỉ chạy nếu tìm thấy container (tránh lỗi null)
  if (container) {
    for (let i = 0; i < 2; i++) {
      partnerLogos.forEach((logo) => {
        const img = document.createElement("img");

        // Gán thuộc tính
        img.src = partnerLogoBasePath + logo.fileName;
        img.alt = logo.alt;

        // Thêm class (tương đương .addClass trong jQuery)
        img.classList.add("logo-ticker-image");

        // Gắn vào HTML (tương đương .append trong jQuery)
        container.appendChild(img);
      });
    }
  }
});

/* ================ 
    Products
  =================== */
document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     LOGIC TABS THAY THẾ CHO JQUERY PLUGIN
     ========================================= */

  // 1. Lấy vùng chứa (Container)
  const tabContainer = document.querySelector("#products-tabs");

  // Kiểm tra an toàn: Nếu trang này không có tabs thì không chạy code để tránh lỗi
  if (!tabContainer) return;

  // 2. Lấy danh sách Nút (li) và Nội dung (div content)
  const tabButtons = tabContainer.querySelectorAll("ul li");
  const tabContents = tabContainer.querySelectorAll(".tab-content-panel");

  // 3. Hàm kích hoạt một Tab cụ thể
  function activateTab(targetBtn) {
    // A. Tắt active của TẤT CẢ nút và ẩn TẤT CẢ nội dung
    tabButtons.forEach((btn) => btn.classList.remove("activeTab"));
    tabContents.forEach((content) => (content.style.display = "none"));

    // B. Bật active cho nút được click
    targetBtn.classList.add("activeTab");

    // C. Hiện nội dung tương ứng
    // Lấy giá trị data-tab (ví dụ: "tab-tra-den")
    const targetId = targetBtn.getAttribute("data-tab");
    const targetPanel = document.getElementById(targetId);

    if (targetPanel) {
      targetPanel.style.display = "block";
    }
  }

  // 4. Khởi tạo ban đầu: Tự động kích hoạt tab đầu tiên
  if (tabButtons.length > 0) {
    activateTab(tabButtons[0]);
  }

  // 5. Lắng nghe sự kiện Click cho từng nút
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      activateTab(this); // "this" chính là nút vừa được bấm
    });
  });
});

/* ================ 
   Best Sellers
  =================== */
$(function () {
  $(".slider").slick({
    autoplay: true,
    dots: true,
  });
});

/* ================ 
 Stats
  =================== */
$(function () {
  const counterUp = window.counterUp.default;

  const callback = (entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting && !el.classList.contains("is-visible")) {
        counterUp(el, {
          duration: 2000,
          delay: 16,
        });
        el.classList.add("is-visible");
      }
    });
  };

  const IO = new IntersectionObserver(callback, { threshold: 1 });

  const el = document
    .querySelectorAll(".counter")
    .forEach((node) => IO.observe(node));
});

/* ================ 
  Tất Cả Sản Phẩm
  =================== */
$(function () {
  productList.map((product) => {
    $("#product-items--container").append(`
      <div data-filterable data-filter-category=${product.category}
 class="relative col-span-3 overflow-hidden group hover:shadow-md">
                <div class="portfolio-item">
                  <div>
                    <img
                      src=${product.img}
                      alt="product-img"
                    />

                    <div class="product-item-overlay">
                      <div class="product-details">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
      `);
  });

  $.fn.filterjitsu();

  // xử lý active tab
  function getAllUrlParam(url) {
    url = url || window.location.href;

    const param = {};

    const queryString = url.split("?")[1];

    if (!queryString) {
      return param;
    }

    const [key, value] = queryString.split("=");

    if (key) {
      param[key] = value ? value : "";
    }

    return param;
  }

  const urlParam = getAllUrlParam();

  $("#allProduct-filters a").removeClass("activeFilter");

  const category = urlParam["filter-category"];

  switch (category) {
    case "whitetea":
      $("#f-whitetea").addClass("activeFilter");
      break;
    case "blacktea":
      $("#f-blacktea").addClass("activeFilter");
      break;
    case "oolong":
      $("#f-oolong").addClass("activeFilter");
      break;
    case "matcha":
      $("#f-matcha").addClass("activeFilter");
      break;
    default:
      $("#f-all").addClass("activeFilter");
      break;
  }
});

/* ================ 
  AOS Animation
  =================== */
document.addEventListener("DOMContentLoaded", () => {
  AOS.init();

  // You can also pass an optional settings object
  // below listed default settings
  AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
    initClassName: "aos-init", // class applied after initialization
    animatedClassName: "aos-animate", // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 100, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 700, // values from 0 to 3000, with step 50ms
    easing: "ease-in-out", // default easing for AOS animations
    once: false, // whether animation should happen only once - while scrolling down
    mirror: true, // whether elements should anima te out while scrolling past them
    anchorPlacement: "center-bottom", // defines which position of the element regarding to window should trigger the animation
  });
});
