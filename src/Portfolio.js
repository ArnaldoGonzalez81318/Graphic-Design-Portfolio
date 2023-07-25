const seo = {
  title: 'Laura | Portfolio',
  description: 'Laura\'s portfolio',
  canonical: 'https://laura.netlify.app/',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://laura.netlify.app/',
    title: 'Laura | Portfolio',
    description: 'Laura\'s portfolio',
    images: [
      {
        url: 'https://laura.netlify.app/images/og.jpg',
        alt: 'Laura\'s portfolio',
        width: 1280,
        height: 720
      }
    ]
  }
};

// Home Page
const greeting = {
  title: 'Hi, I\'m Laura',
  profession: 'Graphic Designer',
  description: "Welcome! I'm Janie Wilson, and I know I can help your company create stunning visuals. As someone who has worked in marketing and graphic design for over a decade, I know what brands need to capture their audiences' attention.With my powerful design skills and knack for marketing, I have the right background for your brand's needs.",
};

const socialMedia = [
  {
    name: 'facebook',
    url: 'https://www.facebook.com/',
  },
  {
    name: 'twitter',
    url: 'https://twitter.com/',
  },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/',
  },
  {
    name: 'linkedin',
    url: 'https://www.linkedin.com/',
  }
];

const skills = {
  data: [
    {
      name: 'Adobe Photoshop',
      percentage: 90,
    },
    {
      name: 'Adobe Illustrator',
      percentage: 80,
    },
    {
      name: 'Adobe XD',
      percentage: 70,
    },
    {
      name: 'Adobe InDesign',
      percentage: 60,
    },
    {
      name: 'Adobe After Effects',
      percentage: 50,
    },
    {
      name: 'Adobe Premiere Pro',
      percentage: 40,
    },
  ]
};

export {
  seo,
  greeting,
  socialMedia,
  skills,
};