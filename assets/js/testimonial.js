let testimonials = [
  {
    author: "John Lennon",
    rating: 5,
    content:
      "Saya sangat terkesan dengan pengalaman saya menggunakan website ini! Desainnya sangat menarik dan mudah dinavigasi, sehingga saya dapat menemukan informasi yang saya butuhkan dengan cepat. Konten yang disajikan sangat informatif dan relevan, membuat saya merasa lebih percaya diri dalam mengambil keputusan.",
    image: "beatles.jpg",
  },
  {
    author: "Jimmy Page",
    rating: 4,
    content:
      "Secara keseluruhan, saya sangat merekomendasikan website ini kepada siapa pun yang mencari informasi berkualitas. Terima kasih telah menyediakan platform yang luar biasa ini!",
    image: "blackpentagram.jpeg",
  },
  {
    author: "Tony Iommi",
    rating: 3,
    content:
      "Saya juga menghargai kecepatan loading halaman yang sangat baik, sehingga saya tidak perlu menunggu lama untuk mengakses informasi. Selain itu, fitur pencarian yang ada sangat membantu saya menemukan artikel-artikel yang saya cari.",
    image: "blackpattern.jpeg",
  },
  {
    author: "John Doe",
    rating: 4,
    content:
      "Ulasan negatif tentang Satanisme sering kali didasarkan pada ketidakpahaman dan ketakutan, yang dapat mengakibatkan diskriminasi dan stigma sosial. Penting untuk mendekati topik ini dengan pemahaman yang lebih baik dan menghindari generalisasi yang dapat merugikan individu yang memiliki pandangan atau kepercayaan yang berbeda.",
    image: "blackbat.jpeg",
  },
  {
    author: "Pandu Rizky",
    rating: 5,
    content:
      "Ulasan negatif tentang Satanisme sering kali muncul karena pandangan masyarakat yang menganggapnya sebagai penyembahan terhadap iblis. Banyak orang terpengaruh oleh stereotip dan ketakutan yang telah ada sejak lama, yang menyebabkan stigma negatif terhadap praktik dan ajaran yang berkaitan dengan Satanisme Pandangan Umum tentang Satanisme",
    image: "blackskull.jpeg",
  },
];

const testimonialsContainer = document.getElementById("testimonialsContainer");

const testimonialsHTML = (daftarTestimoni) => {
  return daftarTestimoni
    .map(
      (testimonial) => `
    <div class="d-flex justify-content-center my-3">
        <div class="card p-3 col mx-0" style="background-color: rgba(255, 255, 255, 0.700);">
            <img src="assets/img/${testimonial.image}" class="card-img-top" alt="..." />
            <div class="card-body px-0 py-0">
              <div class="overflow-y-auto" style="height: 120px">
                <p class="card-text">${testimonial.content}</p>
              </div>
              <div class="text-end fw-bold my-3" style="text-align:justify;">
                <p>- ${testimonial.author}</p>
                <p>${testimonial.rating}✯</p>
              </div>
            </div>
        </div>
    </div>`
    )
    .join("");
};

function showAllTestimonials() {
  testimonialsContainer.innerHTML = testimonialsHTML(testimonials);
}

showAllTestimonials();

function filterTestimonialByStar(rating) {
  const filteredTestimonial = testimonials.filter(
    (testimonial) => testimonial.rating === rating
  );

  console.log(filteredTestimonial);

  if (filteredTestimonial.length === 0) {
    return (testimonialsContainer.innerHTML = 
    `<div style="color:rgb(255, 255, 255);font-weight:bolder;font-size:large;text-align:center;">
    <h1>No testimonials.</h1>
    </div>`);
  }

  setTimeout(() => {
    testimonialsContainer.innerHTML = testimonialsHTML(filteredTestimonial);
  }, 1000);
}
