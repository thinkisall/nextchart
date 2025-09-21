'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingCategoryCard } from '../atoms/TrendingCategoryCard';
import type { TrendingCategory } from '../../lib/services/coingecko';

interface TrendingCategoriesProps {
  categories: TrendingCategory[];
  loading?: boolean;
  onCategoryClick?: (category: TrendingCategory) => void;
  onRefresh?: () => void;
}

export function TrendingCategories({ categories, loading, onCategoryClick, onRefresh }: TrendingCategoriesProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📂</span>
              </div>
              <div>
                <CardTitle className="text-lg">트렌딩 카테고리</CardTitle>
                <CardDescription>인기 검색 카테고리</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-muted">
              로딩중...
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/20 animate-pulse">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="w-8 h-6 bg-muted rounded"></div>
                    <div className="w-12 h-6 bg-muted rounded"></div>
                  </div>
                  <div className="w-3/4 h-4 bg-muted rounded"></div>
                  <div className="w-1/2 h-3 bg-muted rounded"></div>
                  <div className="w-full h-8 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📂</span>
            </div>
            <div>
              <CardTitle className="text-lg">트렌딩 카테고리</CardTitle>
              <CardDescription>인기 검색 카테고리 6개</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100/80 text-blue-700 border-blue-200">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-1"></div>
              LIVE
            </Badge>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                새로고침
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.slice(0, 6).map((category, index) => (
            <TrendingCategoryCard
              key={category.id}
              category={category}
              rank={index + 1}
              onClick={onCategoryClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
