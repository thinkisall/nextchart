import { RouletteWheel } from './RouletteWheel';
import { SpinButton } from './SpinButton';
import { RouletteResultDisplay } from './RouletteResultDisplay';
import { CategorySelector } from './CategorySelector';
import { RouletteStats } from './RouletteStats';
import { useCoinRoulette } from '../hooks/useCoinRoulette';

/**
 * 코인 룰렛 메인 컨테이너 컴포넌트
 * 모든 룰렛 관련 기능을 통합하는 Organism
 */
export function CoinRouletteContainer() {
  const {
    animation,
    currentResult,
    category,
    stats,
    spin,
    setCategory,
    clearHistory,
    canSpin,
    hasResults
  } = useCoinRoulette();

  return (
    <div className="space-y-8">
      {/* 카테고리 선택 */}
      <CategorySelector
        category={category}
        onCategoryChange={setCategory}
        disabled={!canSpin}
      />

      {/* 메인 룰렛 영역 */}
      <div className="text-center space-y-6">
        <RouletteWheel animation={animation} />
        
        <SpinButton
          onSpin={spin}
          disabled={!canSpin}
          category={category}
        />
      </div>

      {/* 결과 표시 */}
      <RouletteResultDisplay 
        result={currentResult}
        className="min-h-[200px]"
      />

      {/* 통계 */}
      {hasResults && (
        <RouletteStats 
          stats={stats}
          onClearHistory={clearHistory}
        />
      )}
    </div>
  );
}
