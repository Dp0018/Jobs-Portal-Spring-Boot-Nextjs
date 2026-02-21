import {
  IconCode,
  IconPalette,
  IconChartBar,
  IconBriefcase,
  IconHeartbeat,
  IconCash,
  IconPencil,
  IconUsers,
  IconDatabase,
  IconDeviceMobile,
  IconBulb,
  IconShield,
} from "@tabler/icons-react";

const categories = [
  { icon: IconCode,         title: "Software Engineer",  description: "Build innovative software solutions and applications",      jobCount: 2847 },
  { icon: IconChartBar,     title: "Digital Marketing",  description: "Drive growth through strategic marketing campaigns",         jobCount: 1523 },
  { icon: IconPalette,      title: "UI/UX Designer",     description: "Create beautiful and intuitive user experiences",            jobCount: 1289 },
  { icon: IconBriefcase,    title: "Business Analyst",   description: "Analyze data and provide strategic insights",                jobCount: 967  },
  { icon: IconHeartbeat,    title: "Healthcare",         description: "Make a difference in patient care and wellness",             jobCount: 2103 },
  { icon: IconCash,         title: "Finance & Banking",  description: "Manage financial operations and investments",                jobCount: 1456 },
  { icon: IconPencil,       title: "Content Writer",     description: "Craft compelling stories and engaging content",              jobCount: 892  },
  { icon: IconUsers,        title: "Human Resources",    description: "Build and nurture organizational talent",                    jobCount: 743  },
  { icon: IconDatabase,     title: "Data Science",       description: "Extract insights from complex data sets",                    jobCount: 1634 },
  { icon: IconDeviceMobile, title: "Mobile Developer",   description: "Create amazing mobile applications",                        jobCount: 1178 },
  { icon: IconBulb,         title: "Product Manager",    description: "Lead product strategy and development",                     jobCount: 821  },
  { icon: IconShield,       title: "Cybersecurity",      description: "Protect systems and data from threats",                     jobCount: 1045 },
];

export const JobCategories = () => {
  return (
    <div className="w-full bg-card px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore by{" "}
            <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover opportunities across various industries and find the
            perfect role that matches your skills
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="group bg-background border border-border hover:border-primary/50 rounded-xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="bg-primary/10 group-hover:bg-primary/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors">
                  <Icon className="h-7 w-7 text-primary" stroke={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>

                {/* Job Count */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">Available Jobs</span>
                  <span className="text-sm font-semibold text-primary">
                    {category.jobCount.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
