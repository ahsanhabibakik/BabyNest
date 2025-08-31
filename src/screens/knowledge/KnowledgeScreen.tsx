import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/common/SafeScreen';
import { useAppStore } from '@/store/appStore';
import { Article } from '@/types';
import { COLORS } from '@/constants';

// Mock articles data
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Breastfeeding Basics: Getting Started',
    summary: 'Essential tips for new mothers on successful breastfeeding',
    content: 'Complete guide to breastfeeding...',
    category: 'baby-care',
    ageRange: '0-6 months',
    tags: ['breastfeeding', 'newborn', 'feeding'],
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    isPremium: false,
    readTime: 5,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Baby Sleep Patterns: What to Expect',
    summary: 'Understanding your baby\'s sleep cycles and how to improve them',
    content: 'Detailed sleep guide...',
    category: 'baby-care',
    ageRange: '0-12 months',
    tags: ['sleep', 'patterns', 'development'],
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400',
    isPremium: false,
    readTime: 7,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Postpartum Depression: Signs and Support',
    summary: 'Recognizing and addressing postpartum mental health challenges',
    content: 'Mental health support guide...',
    category: 'mother-care',
    tags: ['mental health', 'postpartum', 'support'],
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    isPremium: true,
    readTime: 8,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'First Foods: Introduction to Solids',
    summary: 'When and how to start introducing solid foods to your baby',
    content: 'Solid foods introduction guide...',
    category: 'nutrition',
    ageRange: '4-12 months',
    tags: ['weaning', 'solid foods', 'nutrition'],
    imageUrl: 'https://images.unsplash.com/photo-1609501676725-7186f63ba410?w=400',
    isPremium: true,
    readTime: 6,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Baby Development Milestones: 0-12 Months',
    summary: 'Track your baby\'s important developmental milestones',
    content: 'Development milestone guide...',
    category: 'development',
    ageRange: '0-12 months',
    tags: ['milestones', 'development', 'tracking'],
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
    isPremium: false,
    readTime: 10,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ArticleCard: React.FC<{
  article: Article;
  onPress: () => void;
}> = ({ article, onPress }) => (
  <Pressable
    onPress={onPress}
    className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 overflow-hidden"
    style={{ elevation: 2 }}
  >
    {/* Image */}
    {article.imageUrl && (
      <View className="relative">
        <Image 
          source={{ uri: article.imageUrl }}
          className="w-full h-40"
          resizeMode="cover"
        />
        {article.isPremium && (
          <View className="absolute top-3 right-3 bg-orange-500 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">PRO</Text>
          </View>
        )}
        <View className="absolute bottom-3 left-3 bg-black bg-opacity-50 px-2 py-1 rounded-full">
          <Text className="text-white text-xs">
            {article.readTime} min read
          </Text>
        </View>
      </View>
    )}

    <View className="p-4">
      <View className="flex-row items-center mb-2">
        <View className="bg-gray-100 px-2 py-1 rounded-full mr-2">
          <Text className="text-xs font-medium text-gray-700 capitalize">
            {article.category.replace('-', ' ')}
          </Text>
        </View>
        {article.ageRange && (
          <View className="bg-blue-100 px-2 py-1 rounded-full">
            <Text className="text-xs font-medium text-blue-700">
              {article.ageRange}
            </Text>
          </View>
        )}
      </View>

      <Text className="text-lg font-bold text-gray-900 mb-2">
        {article.title}
      </Text>
      
      <Text className="text-gray-600 text-sm leading-5 mb-3">
        {article.summary}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row flex-wrap">
          {article.tags.slice(0, 2).map((tag) => (
            <Text key={tag} className="text-xs text-gray-500 mr-2">
              #{tag}
            </Text>
          ))}
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
      </View>
    </View>
  </Pressable>
);

const CategoryButton: React.FC<{
  title: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ title, isSelected, onPress }) => (
  <Pressable
    onPress={onPress}
    className={`py-2 px-4 rounded-full mr-3 ${
      isSelected
        ? 'bg-orange-500'
        : 'bg-gray-100'
    }`}
  >
    <Text
      className={`font-medium text-sm ${
        isSelected ? 'text-white' : 'text-gray-700'
      }`}
    >
      {title}
    </Text>
  </Pressable>
);

export const KnowledgeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { articles, setArticles, isPremium } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Load mock articles
    setArticles(mockArticles);
  }, [setArticles]);

  const categories = [
    { key: 'all', title: 'All' },
    { key: 'baby-care', title: 'Baby Care' },
    { key: 'mother-care', title: 'Mother Care' },
    { key: 'nutrition', title: 'Nutrition' },
    { key: 'development', title: 'Development' },
    { key: 'health', title: 'Health' },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const freeArticles = filteredArticles.filter(a => !a.isPremium);
  const premiumArticles = filteredArticles.filter(a => a.isPremium);

  const handleArticlePress = (article: Article) => {
    if (article.isPremium && !isPremium) {
      navigation.navigate('Paywall', { source: 'premium-article' });
    } else {
      navigation.navigate('ArticleDetail', { articleId: article.id });
    }
  };

  return (
    <SafeScreen>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-6 pt-4 pb-6 bg-white">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-900">
              Knowledge Hub
            </Text>
            <Pressable>
              <Ionicons name="bookmark-outline" size={24} color={COLORS.neutral} />
            </Pressable>
          </View>

          {/* Search */}
          <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
            <Ionicons name="search" size={20} color={COLORS.neutral} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search articles..."
              className="flex-1 ml-3 text-base"
            />
          </View>
        </View>

        <ScrollView className="flex-1">
          {/* Categories */}
          <View className="px-6 py-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <CategoryButton
                  key={category.key}
                  title={category.title}
                  isSelected={selectedCategory === category.key}
                  onPress={() => setSelectedCategory(category.key)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Featured Article */}
          {!searchQuery && selectedCategory === 'all' && freeArticles.length > 0 && (
            <View className="px-6 mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Featured Article
              </Text>
              <ArticleCard
                article={freeArticles[0]}
                onPress={() => handleArticlePress(freeArticles[0])}
              />
            </View>
          )}

          {/* Free Articles */}
          {freeArticles.length > 0 && (
            <View className="px-6 mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                {searchQuery || selectedCategory !== 'all' ? 'Articles' : 'More Articles'}
              </Text>
              {freeArticles.slice(searchQuery || selectedCategory !== 'all' ? 0 : 1).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onPress={() => handleArticlePress(article)}
                />
              ))}
            </View>
          )}

          {/* Premium Articles */}
          {premiumArticles.length > 0 && (
            <View className="px-6 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-gray-900">
                  Premium Articles
                </Text>
                <View className="bg-orange-100 px-2 py-1 rounded-full">
                  <Text className="text-orange-600 text-xs font-medium">PRO</Text>
                </View>
              </View>
              {premiumArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onPress={() => handleArticlePress(article)}
                />
              ))}
            </View>
          )}

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <View className="px-6 py-12 items-center">
              <Text className="text-4xl mb-4">📚</Text>
              <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
                No Articles Found
              </Text>
              <Text className="text-gray-600 text-center">
                Try adjusting your search or category filter
              </Text>
            </View>
          )}

          {/* Premium Upgrade */}
          {!isPremium && (
            <View className="mx-6 mb-6 p-5 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl border border-orange-200">
              <View className="flex-row items-center mb-3">
                <Text className="text-2xl mr-2">⭐</Text>
                <Text className="text-lg font-bold text-gray-900">
                  Unlock All Articles
                </Text>
              </View>
              <Text className="text-gray-600 mb-3">
                Get access to expert parenting advice, in-depth guides, and exclusive content
              </Text>
              <Pressable
                onPress={() => navigation.navigate('Paywall')}
                className="py-2 px-4 rounded-full self-start"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Text className="text-white font-medium text-sm">
                  Try 7 Days Free
                </Text>
              </Pressable>
            </View>
          )}

          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeScreen>
  );
};