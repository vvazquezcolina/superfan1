import { PrismaService } from '../database/prisma.service';
import {
  ReconciliationEntry,
  DailyReconciliation,
  SettlementReport,
  PaymentMethod,
  Transaction,
  TransactionStatus,
  AuditEntry,
  AuditAction
} from '@mandala/shared-types';

export interface ExternalTransactionData {
  id: string;
  amount: number;
  fees: number;
  currency: string;
  status: string;
  processedAt: Date;
  settlementDate?: Date;
  metadata?: Record<string, any>;
}

export interface ProviderSettlementData {
  provider: PaymentMethod;
  settlementId: string;
  settlementDate: Date;
  periodStart: Date;
  periodEnd: Date;
  transactions: ExternalTransactionData[];
  totalAmount: number;
  totalFees: number;
  netAmount: number;
}

export class ReconciliationService {
  constructor(private databaseService: PrismaService) {}

  // Process daily reconciliation for all payment providers
  async processDailyReconciliation(date: Date): Promise<DailyReconciliation[]> {
    const results: DailyReconciliation[] = [];
    const dateString = date.toISOString().split('T')[0];

    // Process reconciliation for each payment provider
    for (const provider of Object.values(PaymentMethod)) {
      if (provider === PaymentMethod.QR_CODE) continue; // Skip internal QR payments

      const reconciliation = await this.reconcileProviderTransactions(provider, date);
      results.push(reconciliation);
    }

    // Store reconciliation results
    await this.storeDailyReconciliation(results);

    return results;
  }

  // Reconcile transactions for a specific provider
  async reconcileProviderTransactions(provider: PaymentMethod, date: Date): Promise<DailyReconciliation> {
    const dateString = date.toISOString().split('T')[0];
    
    // Get internal transactions for the day
    const internalTransactions = await this.getInternalTransactions(provider, date);
    
    // Get external transactions from payment provider
    const externalTransactions = await this.getExternalTransactions(provider, date);
    
    // Match transactions
    const reconciliationEntries = await this.matchTransactions(
      internalTransactions,
      externalTransactions,
      provider
    );

    // Calculate totals
    const totals = this.calculateReconciliationTotals(internalTransactions, reconciliationEntries);

    const reconciliation: DailyReconciliation = {
      date: dateString,
      provider: provider,
      transactionCount: internalTransactions.length,
      totalAmount: totals.totalAmount,
      totalFees: totals.totalFees,
      netAmount: totals.netAmount,
      matchedTransactions: reconciliationEntries.filter(r => r.status === 'matched').length,
      unmatchedTransactions: reconciliationEntries.filter(r => r.status === 'unmatched').length,
      discrepancyAmount: totals.discrepancyAmount,
      status: totals.discrepancyAmount === 0 ? 'completed' : 'disputed',
      startTime: new Date(),
      completedTime: new Date(),
      reconcilationEntries: reconciliationEntries
    };

    return reconciliation;
  }

  // Match internal and external transactions
  private async matchTransactions(
    internalTransactions: Transaction[],
    externalTransactions: ExternalTransactionData[],
    provider: PaymentMethod
  ): Promise<ReconciliationEntry[]> {
    const entries: ReconciliationEntry[] = [];
    const matchedExternal = new Set<string>();

    // Match internal transactions with external ones
    for (const internal of internalTransactions) {
      let bestMatch: ExternalTransactionData | null = null;
      let matchConfidence = 0;

      // Find best matching external transaction
      for (const external of externalTransactions) {
        if (matchedExternal.has(external.id)) continue;

        const confidence = this.calculateMatchConfidence(internal, external, provider);
        if (confidence > matchConfidence && confidence > 0.8) { // 80% confidence threshold
          bestMatch = external;
          matchConfidence = confidence;
        }
      }

      if (bestMatch) {
        matchedExternal.add(bestMatch.id);
        
        const discrepancy = internal.amount - bestMatch.amount;
        const fees = bestMatch.fees || this.calculateExpectedFees(internal.amount, provider);

        entries.push({
          id: `recon_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          transactionId: internal.id,
          externalTransactionId: bestMatch.id,
          paymentProvider: provider,
          internalAmount: internal.amount,
          externalAmount: bestMatch.amount,
          fees: fees,
          netAmount: bestMatch.amount - fees,
          status: Math.abs(discrepancy) < 0.01 ? 'matched' : 'disputed',
          discrepancy: discrepancy,
          reconciliationDate: new Date(),
          settlementDate: bestMatch.settlementDate
        });
      } else {
        // No matching external transaction found
        entries.push({
          id: `recon_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          transactionId: internal.id,
          externalTransactionId: '',
          paymentProvider: provider,
          internalAmount: internal.amount,
          externalAmount: 0,
          fees: 0,
          netAmount: 0,
          status: 'unmatched',
          discrepancy: internal.amount,
          reconciliationDate: new Date(),
          notes: 'No matching external transaction found'
        });
      }
    }

    return entries;
  }

  // Calculate match confidence between internal and external transactions
  private calculateMatchConfidence(
    internal: Transaction,
    external: ExternalTransactionData,
    provider: PaymentMethod
  ): number {
    let confidence = 0;

    // Amount match (most important factor - 60% weight)
    const amountDiff = Math.abs(internal.amount - external.amount);
    const amountMatch = Math.max(0, 1 - (amountDiff / internal.amount));
    confidence += amountMatch * 0.6;

    // Time proximity (30% weight)
    const timeDiff = Math.abs(internal.createdAt.getTime() - external.processedAt.getTime());
    const maxTimeDiff = 24 * 60 * 60 * 1000; // 24 hours
    const timeMatch = Math.max(0, 1 - (timeDiff / maxTimeDiff));
    confidence += timeMatch * 0.3;

    // Provider-specific matching (10% weight)
    if (this.hasProviderSpecificMatch(internal, external, provider)) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1);
  }

  // Check for provider-specific matching criteria
  private hasProviderSpecificMatch(
    internal: Transaction,
    external: ExternalTransactionData,
    provider: PaymentMethod
  ): boolean {
    switch (provider) {
      case PaymentMethod.STRIPE:
        return internal.metadata?.stripePaymentIntentId === external.metadata?.payment_intent_id;
      case PaymentMethod.OXXO_PAY:
        return internal.metadata?.oxxoReference === external.metadata?.reference;
      case PaymentMethod.SPEI:
        return internal.metadata?.speiReference === external.metadata?.reference;
      default:
        return false;
    }
  }

  // Calculate expected fees based on provider and amount
  private calculateExpectedFees(amount: number, provider: PaymentMethod): number {
    switch (provider) {
      case PaymentMethod.STRIPE:
        return (amount * 0.036) + 3; // 3.6% + 3 MXN
      case PaymentMethod.OXXO_PAY:
        return (amount * 0.0185) + 7; // 1.85% + 7 MXN
      case PaymentMethod.SPEI:
        return (amount * 0.007) + 2; // 0.7% + 2 MXN
      case PaymentMethod.APPLE_PAY:
        return (amount * 0.029) + 3; // 2.9% + 3 MXN
      default:
        return 0;
    }
  }

  // Calculate reconciliation totals
  private calculateReconciliationTotals(
    transactions: Transaction[],
    entries: ReconciliationEntry[]
  ): {
    totalAmount: number;
    totalFees: number;
    netAmount: number;
    discrepancyAmount: number;
  } {
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalFees = entries.reduce((sum, e) => sum + e.fees, 0);
    const netAmount = totalAmount - totalFees;
    const discrepancyAmount = entries.reduce((sum, e) => sum + Math.abs(e.discrepancy || 0), 0);

    return { totalAmount, totalFees, netAmount, discrepancyAmount };
  }

  // Process settlement report
  async processSettlement(
    provider: PaymentMethod,
    settlementData: ProviderSettlementData
  ): Promise<SettlementReport> {
    // Get previous balance
    const previousSettlement = await this.getLastSettlement(provider);
    const previousBalance = previousSettlement?.finalBalance || 0;

    // Calculate settlement amounts
    const grossAmount = settlementData.totalAmount;
    const totalFees = settlementData.totalFees;
    const netAmount = grossAmount - totalFees;
    const settlementAmount = netAmount; // Simplified - could include adjustments
    const finalBalance = previousBalance + settlementAmount;

    const settlement: SettlementReport = {
      id: `settlement_${Date.now()}`,
      provider: provider,
      settlementDate: settlementData.settlementDate,
      periodStart: settlementData.periodStart,
      periodEnd: settlementData.periodEnd,
      totalTransactions: settlementData.transactions.length,
      grossAmount: grossAmount,
      totalFees: totalFees,
      netAmount: netAmount,
      previousBalance: previousBalance,
      settlementAmount: settlementAmount,
      finalBalance: finalBalance,
      status: 'completed',
      referenceNumber: settlementData.settlementId,
      processedBy: 'system'
    };

    // Store settlement report
    await this.storeSettlementReport(settlement);

    // Create audit entry
    await this.createAuditEntry({
      userId: 'system',
      action: AuditAction.SETTLE,
      entityType: 'reconciliation',
      entityId: settlement.id,
      changes: [{
        field: 'settlement_processed',
        oldValue: null,
        newValue: settlement,
        changeType: 'added'
      }]
    });

    return settlement;
  }

  // Resolve discrepancies
  async resolveDiscrepancy(
    reconciliationEntryId: string,
    resolution: 'accept_internal' | 'accept_external' | 'manual_adjustment',
    adjustmentAmount?: number,
    notes?: string,
    resolvedBy?: string
  ): Promise<ReconciliationEntry> {
    const entry = await this.getReconciliationEntry(reconciliationEntryId);
    if (!entry) {
      throw new Error('Reconciliation entry not found');
    }

    let resolvedEntry = { ...entry };

    switch (resolution) {
      case 'accept_internal':
        resolvedEntry.externalAmount = entry.internalAmount;
        resolvedEntry.discrepancy = 0;
        break;
      case 'accept_external':
        resolvedEntry.internalAmount = entry.externalAmount;
        resolvedEntry.discrepancy = 0;
        break;
      case 'manual_adjustment':
        if (adjustmentAmount !== undefined) {
          resolvedEntry.externalAmount += adjustmentAmount;
          resolvedEntry.discrepancy = entry.internalAmount - resolvedEntry.externalAmount;
        }
        break;
    }

    resolvedEntry.status = 'resolved';
    resolvedEntry.notes = notes || '';

    // Update reconciliation entry
    await this.updateReconciliationEntry(resolvedEntry);

    // Create audit entry
    await this.createAuditEntry({
      userId: resolvedBy || 'system',
      action: AuditAction.RECONCILE,
      entityType: 'reconciliation',
      entityId: reconciliationEntryId,
      previousState: entry,
      newState: resolvedEntry,
      changes: [{
        field: 'status',
        oldValue: entry.status,
        newValue: 'resolved',
        changeType: 'modified'
      }],
      reason: notes
    });

    return resolvedEntry;
  }

  // Get transactions requiring reconciliation
  async getUnreconciledTransactions(provider: PaymentMethod, days: number = 7): Promise<Transaction[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.databaseService.getUnreconciledTransactions(provider, startDate);
  }

  // Get reconciliation summary
  async getReconciliationSummary(
    provider?: PaymentMethod,
    dateRange?: { startDate: Date; endDate: Date }
  ): Promise<{
    totalTransactions: number;
    matchedTransactions: number;
    unmatchedTransactions: number;
    disputedTransactions: number;
    totalDiscrepancy: number;
    averageProcessingTime: number;
  }> {
    const reconciliations = await this.getReconciliationHistory(provider, dateRange);
    
    const totals = reconciliations.reduce((acc, recon) => {
      acc.totalTransactions += recon.transactionCount;
      acc.matchedTransactions += recon.matchedTransactions;
      acc.unmatchedTransactions += recon.unmatchedTransactions;
      acc.totalDiscrepancy += recon.discrepancyAmount;
      return acc;
    }, {
      totalTransactions: 0,
      matchedTransactions: 0,
      unmatchedTransactions: 0,
      disputedTransactions: 0,
      totalDiscrepancy: 0
    });

    const disputedTransactions = totals.totalTransactions - totals.matchedTransactions - totals.unmatchedTransactions;
    const averageProcessingTime = this.calculateAverageProcessingTime(reconciliations);

    return {
      ...totals,
      disputedTransactions,
      averageProcessingTime
    };
  }

  // Mock external data retrieval methods (would integrate with actual providers)
  private async getInternalTransactions(provider: PaymentMethod, date: Date): Promise<Transaction[]> {
    return await this.databaseService.getTransactionsByProviderAndDate(provider, date);
  }

  private async getExternalTransactions(provider: PaymentMethod, date: Date): Promise<ExternalTransactionData[]> {
    // Mock external transaction data - in production, would call provider APIs
    const baseAmount = 100;
    const count = Math.floor(Math.random() * 10) + 5; // 5-15 transactions
    
    const transactions: ExternalTransactionData[] = [];
    for (let i = 0; i < count; i++) {
      const amount = baseAmount + (Math.random() * 200);
      transactions.push({
        id: `ext_${provider}_${Date.now()}_${i}`,
        amount: amount,
        fees: this.calculateExpectedFees(amount, provider),
        currency: 'MXN',
        status: 'completed',
        processedAt: new Date(date.getTime() + (Math.random() * 24 * 60 * 60 * 1000)),
        metadata: {
          provider: provider,
          reference: `ref_${Date.now()}_${i}`
        }
      });
    }

    return transactions;
  }

  // Database operations (mock implementations)
  private async storeDailyReconciliation(reconciliations: DailyReconciliation[]): Promise<void> {
    console.log('Storing daily reconciliation:', reconciliations.length, 'providers');
  }

  private async getLastSettlement(provider: PaymentMethod): Promise<SettlementReport | null> {
    // Mock - would query database for last settlement
    return null;
  }

  private async storeSettlementReport(settlement: SettlementReport): Promise<void> {
    console.log('Storing settlement report:', settlement.id);
  }

  private async getReconciliationEntry(id: string): Promise<ReconciliationEntry | null> {
    // Mock - would query database
    return null;
  }

  private async updateReconciliationEntry(entry: ReconciliationEntry): Promise<void> {
    console.log('Updating reconciliation entry:', entry.id);
  }

  private async createAuditEntry(entry: Partial<AuditEntry>): Promise<void> {
    console.log('Creating audit entry:', entry.action, entry.entityType);
  }

  private async getReconciliationHistory(
    provider?: PaymentMethod,
    dateRange?: { startDate: Date; endDate: Date }
  ): Promise<DailyReconciliation[]> {
    // Mock - would query database
    return [];
  }

  private calculateAverageProcessingTime(reconciliations: DailyReconciliation[]): number {
    const times = reconciliations
      .filter(r => r.completedTime)
      .map(r => r.completedTime!.getTime() - r.startTime.getTime());
    
    return times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      return !!(this.databaseService);
    } catch (error) {
      console.error('Reconciliation service health check failed:', error);
      return false;
    }
  }
} 