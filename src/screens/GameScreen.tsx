import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Hand, Zap } from 'lucide-react-native';
import { assets } from '../assets';
import { AppBackground } from '../components/AppBackground';
import { BalanceBadge, formatCoins } from '../components/BalanceBadge';
import { Board } from '../components/Board';
import { CascadeBanner } from '../components/CascadeBanner';
import { GhostButton } from '../components/GhostButton';
import { RoundIconButton } from '../components/RoundIconButton';
import { PauseSheet } from '../components/PauseSheet';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatStrip } from '../components/StatStrip';
import { GoldButton } from '../components/GoldButton';
import { BET } from '../constants/config';
import { theme } from '../constants/theme';
import { useGameSession, type SessionSummary } from '../hooks/useGameSession';
import { useStoreValue } from '../hooks/useStore';
import type { Go } from './types';

type Props = {
  go: Go;
  onGameOver: (summary: SessionSummary) => void;
};

/** Stable empty array so turning WIN HIGHLIGHT off does not remount the board. */
const NO_HIGHLIGHT: number[] = [];

/** Archetype G3 - header, board area, stat strip, controls block. */
export function GameScreen({ go, onGameOver }: Props) {
  const coins = useStoreValue(s => s.coins);
  const highContrast = useStoreValue(s => s.settings.highContrast);
  const winHighlight = useStoreValue(s => s.settings.winHighlight);
  const [paused, setPaused] = useState(false);

  const session = useGameSession(onGameOver);
  const {
    grid,
    winCells,
    phase,
    banner,
    lastWin,
    multi,
    favour,
    started,
    level,
    colAnims,
    spinsLeft,
    canSpinNow,
    reducedMotion,
    spin,
    collect,
  } = session;

  const resolving = phase === 'spinning' || phase === 'resolving';

  const onPause = useCallback(() => setPaused(true), []);
  const onResume = useCallback(() => setPaused(false), []);
  const onSettings = useCallback(() => {
    setPaused(false);
    go('settings');
  }, [go]);
  const onMenu = useCallback(() => {
    setPaused(false);
    go('menu');
  }, [go]);

  const headerLine =
    'LEVEL ' + (level.index + 1) + ' · ' + level.name + ' · ' + spinsLeft + ' SPINS LEFT';

  return (
    <AppBackground variant="game" dust={10}>
      <ScreenHeader
        title={'TARGET ' + formatCoins(level.target)}
        subtitle={headerLine}
        accent={theme.colors.borderGold}
        leftSlot={
          <RoundIconButton icon={assets.iconPause} label="PAUSE" onPress={onPause} size={48} />
        }
        rightSlot={<BalanceBadge coins={coins} compact />}
      />

      <View style={styles.area}>
        <View style={styles.bannerSlot}>
          <CascadeBanner text={banner} reducedMotion={reducedMotion} />
        </View>

        <Board
          grid={grid}
          winCells={winHighlight ? winCells : NO_HIGHLIGHT}
          dimmed={!started}
          highContrast={highContrast}
          reducedMotion={reducedMotion}
          colAnims={colAnims}
          hint={started ? undefined : 'TAP SPIN TO CALL THE STORM'}
        />

        {started ? (
          <View style={styles.winRow}>
            <Text style={styles.winLabel} numberOfLines={1}>
              LAST SPIN
            </Text>
            <Text style={styles.winValue} numberOfLines={1}>
              {'+' + formatCoins(lastWin)}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.bottom}>
        <View style={styles.stripWrap}>
          <StatStrip bet={BET} favour={favour} multi={multi} />
        </View>
        <View style={styles.controls}>
          <GoldButton
            label={resolving ? 'TUMBLING...' : 'SPIN'}
            Icon={Zap}
            onPress={spin}
            disabled={!canSpinNow}
            height={64}
            testID="spin"
          />
          <View style={styles.collect}>
            <GhostButton
              label="COLLECT"
              Icon={Hand}
              onPress={collect}
              tone="purple"
              disabled={!started || resolving}
            />
          </View>
          <Text style={styles.hint} numberOfLines={1}>
            {'8 OR MORE OF A KIND PAY · BET ' + BET + ' PER SPIN'}
          </Text>
        </View>
      </View>

      <PauseSheet
        visible={paused}
        onResume={onResume}
        onSettings={onSettings}
        onMenu={onMenu}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  bannerSlot: { height: 40, justifyContent: 'center', marginBottom: 8 },
  winRow: {
    marginTop: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(28,28,36,0.8)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  winLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
  },
  winValue: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  bottom: {},
  stripWrap: { paddingHorizontal: 16 },
  controls: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderColor: theme.colors.borderGold,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
  },
  collect: { marginTop: 10 },
  hint: {
    marginTop: 10,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
