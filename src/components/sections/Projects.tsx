'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Eye, Calendar, ArrowLeft, Award, AlertCircle } from 'lucide-react';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  category?: string | null;
  clientName?: string | null;
  location?: string | null;
  completedAt?: string | null;
  featured?: boolean;
  createdAt: string;
}

const categoryGradients: Record<string, string> = {
  'مظلات كهربائية': 'from-[#1a56db]/90 to-[#1e3a5f]/90',
  'مظلات سيارات': 'from-[#ea580c]/90 to-[#c2410c]/90',
  'حدائق': 'from-[#059669]/90 to-[#047857]/90',
  'مسابح': 'from-[#0891b2]/90 to-[#0e7490]/90',
};

const defaultGradients = [
  'from-[#1a56db]/90 to-[#1e3a5f]/90',
  'from-[#ea580c]/90 to-[#c2410c]/90',
  'from-[#059669]/90 to-[#047857]/90',
  'from-[#0891b2]/90 to-[#0e7490]/90',
  'from-[#1a56db]/90 to-[#2563eb]/90',
  'from-[#059669]/90 to-[#10b981]/90',
];

const defaultCategories = ['الكل', 'مظلات كهربائية', 'مظلات سيارات', 'حدائق', 'مسابح'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden border border-gray-100 bg-white h-full">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-5">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const gradient = categoryGradients[project.category || ''] || defaultGradients[index % defaultGradients.length];
  const year = project.completedAt
    ? new Date(project.completedAt).getFullYear().toString()
    : new Date(project.createdAt).getFullYear().toString();

  return (
    <motion.div variants={itemVariants} layout className="group">
      <Card className="overflow-hidden border border-gray-100 bg-white hover:border-[#1a56db]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#1a56db]/5 hover:-translate-y-1 h-full">
        {/* Image placeholder with overlay */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          ) : null}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
          />
          {/* Decorative pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(45deg, rgba(255,255,255,.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.1) 50%, rgba(255,255,255,.1) 75%, transparent 75%, transparent)',
              backgroundSize: '20px 20px',
            }}
          />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Eye className="h-7 w-7 text-white transform group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge className="bg-white/90 text-[#0f172a] hover:bg-white border-0 text-xs font-semibold px-3 py-1 backdrop-blur-sm">
              {project.category || 'مشاريع'}
            </Badge>
            {project.featured && (
              <Badge className="bg-[#f59e0b]/90 text-white hover:bg-[#f59e0b] border-0 text-xs font-semibold px-3 py-1 backdrop-blur-sm">
                مميز
              </Badge>
            )}
          </div>

          {/* Location badge */}
          {(project.location || year) && (
            <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between">
              {project.location && (
                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <MapPin className="h-3.5 w-3.5 text-white" />
                  <span className="text-white text-xs font-medium">
                    {project.location}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <Calendar className="h-3.5 w-3.5 text-white" />
                <span className="text-white text-xs font-medium">
                  {year}
                </span>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#0f172a]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-white text-sm text-center px-6 leading-relaxed max-w-[90%]">
              {project.description}
            </p>
          </div>
        </div>

        {/* Card content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[#1a56db] transition-colors duration-300 mb-2">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-[#64748b] text-sm">
            <MapPin className="h-4 w-4" />
            <span>{project.location || 'المملكة العربية السعودية'}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [activeTab, setActiveTab] = useState('الكل');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.data || []);
        } else {
          setError('حدث خطأ أثناء تحميل المشاريع');
        }
      })
      .catch(() => {
        setError('تعذر الاتصال بالخادم');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category).filter(Boolean) as string[]);
    return ['الكل', ...Array.from(cats)];
  }, [projects]);

  const filteredProjects =
    activeTab === 'الكل'
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <section
      id="projects"
      className="relative py-20 lg:py-28 gradient-section overflow-hidden"
    >
      {/* Decorative background shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#1a56db]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ea580c]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-[#ea580c]" />
            <span className="text-sm font-semibold text-[#ea580c] tracking-wide">
              أعمالنا
            </span>
            <Award className="h-5 w-5 text-[#ea580c]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-4">
            مشاريعنا المميزة
          </h2>
          <div className="w-20 h-1 bg-[#1a56db] mx-auto rounded-full mb-6" />
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto leading-relaxed">
            نفخر بتقديم أفضل المشاريع التي نفذناها لعملائنا
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-[#64748b] text-lg mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="text-[#1a56db] border-[#1a56db] hover:bg-[#1a56db] hover:text-white"
            >
              إعادة المحاولة
            </Button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && !error && <ProjectsSkeleton />}

        {!isLoading && !error && (
          <>
            {/* Filter Tabs */}
            {categories.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-12"
              >
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full max-w-2xl"
                >
                  <TabsList className="w-full h-auto p-1.5 flex flex-wrap justify-center gap-1 bg-gray-100/80 rounded-xl">
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="data-[state=active]:bg-[#1a56db] data-[state=active]:text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </motion.div>
            )}

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty state */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-[#64748b] text-lg">
                  لا توجد مشاريع في هذا التصنيف حالياً
                </p>
              </motion.div>
            )}

            {/* Show More Button */}
            {filteredProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-14 text-center"
              >
                <Button
                  size="lg"
                  className="bg-[#1a56db] hover:bg-[#1a56db]/90 text-white font-bold text-base px-10 py-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#1a56db]/20 transition-all duration-300 gap-3"
                >
                  عرض المزيد
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
