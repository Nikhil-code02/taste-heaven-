import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Plus, Edit, Trash2, Check } from 'lucide-react';
import { PaymentMethod, paymentService } from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ProfileComponents.module.css';
import toast from 'react-hot-toast';

interface PaymentFormData {
  type: 'credit' | 'debit' | 'paypal' | 'applepay' | 'googlepay';
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover';
  nameOnCard: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isDefault: boolean;
  email?: string; // For PayPal
}

const initialFormData: PaymentFormData = {
  type: 'credit',
  cardType: 'visa',
  nameOnCard: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  isDefault: false,
  email: ''
};

const Payment: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData);
  
  const loadPaymentMethods = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const methods = await paymentService.getUserPaymentMethods(currentUser.uid);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  useEffect(() => {
    loadPaymentMethods();
  }, [loadPaymentMethods]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setShowAddForm(false);
    setEditingPaymentId(null);
  };
  
  const handlePaymentEdit = (payment: PaymentMethod) => {
    // Since we don't store full card numbers, we'll just use the form for basic info
    setFormData({
      type: payment.type,
      cardType: payment.cardType,
      nameOnCard: payment.nameOnCard || '',
      cardNumber: `****${payment.last4}`,
      expiryMonth: payment.expiryMonth || '',
      expiryYear: payment.expiryYear || '',
      cvv: '',
      isDefault: payment.isDefault,
      email: payment.email || ''
    });
    
    setEditingPaymentId(payment.id!);
    setShowAddForm(true);
  };
  
  const handlePaymentDelete = async (paymentId: string) => {
    if (!currentUser) return;
    
    try {
      await paymentService.deletePaymentMethod(currentUser.uid, paymentId);
      setPaymentMethods(prevMethods => prevMethods.filter(method => method.id !== paymentId));
      toast.success('Payment method deleted successfully');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    }
  };
  
  const handleSetDefault = async (paymentId: string) => {
    if (!currentUser) return;
    
    try {
      await paymentService.updatePaymentMethod(currentUser.uid, paymentId, { isDefault: true });
      
      // Update local state
      setPaymentMethods(prevMethods => 
        prevMethods.map(method => ({
          ...method,
          isDefault: method.id === paymentId
        }))
      );
      
      toast.success('Default payment method updated');
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to update default payment method');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      // In a real application, this would involve integrating with a payment processor
      // to securely handle card information. This is just a simplified example.
      
      // Get last 4 digits of card number
      const last4 = formData.cardNumber.slice(-4);
      
      const paymentData = {
        type: formData.type,
        cardType: formData.cardType,
        nameOnCard: formData.nameOnCard,
        last4: last4,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        isDefault: formData.isDefault,
        email: formData.email
      };
      
      if (editingPaymentId) {
        // Update existing payment method
        await paymentService.updatePaymentMethod(currentUser.uid, editingPaymentId, paymentData);
        
        // Update local state
        setPaymentMethods(prevMethods => 
          prevMethods.map(method => 
            method.id === editingPaymentId 
              ? { ...method, ...paymentData } 
              : paymentData.isDefault ? { ...method, isDefault: false } : method
          )
        );
        
        toast.success('Payment method updated successfully');
      } else {
        // Add new payment method
        const paymentId = await paymentService.addPaymentMethod(currentUser.uid, paymentData);
        
        // Add to local state
        const newPayment: PaymentMethod = {
          id: paymentId,
          userId: currentUser.uid,
          ...paymentData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setPaymentMethods(prevMethods => {
          const updatedMethods = paymentData.isDefault 
            ? prevMethods.map(method => ({ ...method, isDefault: false }))
            : [...prevMethods];
            
          return [...updatedMethods, newPayment];
        });
        
        toast.success('Payment method added successfully');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('Failed to save payment method');
    }
  };
  
  const getCardIcon = (type?: string) => {
    // In a real app, you would use proper card brand icons
    return <CreditCard size={28} className={styles.cardIcon} />;
  };
  
  const formatCardNumber = (last4: string) => {
    return `•••• •••• •••• ${last4}`;
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
  
  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentHeader}>
        <h2 className={styles.sectionTitle}>Payment Methods</h2>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className={styles.addButton}
          >
            <Plus size={16} />
            Add New Payment Method
          </button>
        )}
      </div>
      
      {showAddForm ? (
        <div className={styles.paymentForm}>
          <h3>{editingPaymentId ? 'Edit Payment Method' : 'Add New Payment Method'}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="type">Payment Type</label>
              <select 
                id="type" 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                required
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="applepay">Apple Pay</option>
                <option value="googlepay">Google Pay</option>
              </select>
            </div>
            
            {formData.type === 'paypal' ? (
              <div className={styles.formGroup}>
                <label htmlFor="email">PayPal Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="cardType">Card Type</label>
                  <select 
                    id="cardType" 
                    name="cardType" 
                    value={formData.cardType} 
                    onChange={handleChange}
                    required
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="nameOnCard">Name on Card</label>
                  <input 
                    type="text" 
                    id="nameOnCard" 
                    name="nameOnCard" 
                    value={formData.nameOnCard} 
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="cardNumber">Card Number</label>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    name="cardNumber" 
                    value={formData.cardNumber} 
                    onChange={handleChange}
                    placeholder="•••• •••• •••• ••••"
                    maxLength={19}
                    required
                    disabled={!!editingPaymentId}
                  />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="expiryMonth">Expiry Month</label>
                    <select 
                      id="expiryMonth" 
                      name="expiryMonth" 
                      value={formData.expiryMonth} 
                      onChange={handleChange}
                      required
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        return <option key={month} value={month}>{month}</option>;
                      })}
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="expiryYear">Expiry Year</label>
                    <select 
                      id="expiryYear" 
                      name="expiryYear" 
                      value={formData.expiryYear} 
                      onChange={handleChange}
                      required
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString();
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="cvv">CVV</label>
                    <input 
                      type="text" 
                      id="cvv" 
                      name="cvv" 
                      value={formData.cvv} 
                      onChange={handleChange}
                      maxLength={4}
                      placeholder={editingPaymentId ? '***' : ''}
                      required={!editingPaymentId}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  name="isDefault" 
                  checked={formData.isDefault} 
                  onChange={handleCheckboxChange}
                />
                Set as default payment method
              </label>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={resetForm}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
              >
                {editingPaymentId ? 'Update Payment Method' : 'Add Payment Method'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {paymentMethods.length === 0 ? (
            <div className={styles.emptyState}>
              <CreditCard size={48} className={styles.emptyIcon} />
              <p>You haven't added any payment methods yet.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className={styles.actionButton}
              >
                <Plus size={16} />
                Add Payment Method
              </button>
            </div>
          ) : (
            <div className={styles.paymentList}>
              {paymentMethods.map((payment) => (
                <div key={payment.id} className={styles.paymentCard}>
                  <div className={styles.paymentIcon}>
                    {getCardIcon(payment.cardType)}
                  </div>
                  <div className={styles.paymentContent}>
                    {payment.type === 'paypal' ? (
                      <>
                        <h3>PayPal</h3>
                        <p className={styles.paymentEmail}>{payment.email}</p>
                      </>
                    ) : (
                      <>
                        <div className={styles.paymentHeader}>
                          <h3>{payment.cardType?.toUpperCase()}</h3>
                          {payment.isDefault && (
                            <span className={styles.defaultBadge}>
                              <Check size={12} />
                              Default
                            </span>
                          )}
                        </div>
                        <p className={styles.paymentNumber}>{formatCardNumber(payment.last4)}</p>
                        {payment.nameOnCard && (
                          <p className={styles.paymentName}>{payment.nameOnCard}</p>
                        )}
                        {payment.expiryMonth && payment.expiryYear && (
                          <p className={styles.paymentExpiry}>
                            Expires {payment.expiryMonth}/{payment.expiryYear}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.paymentActions}>
                    <button 
                      onClick={() => handlePaymentEdit(payment)}
                      className={styles.editButton}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handlePaymentDelete(payment.id!)}
                      className={styles.deleteButton}
                    >
                      <Trash2 size={16} />
                    </button>
                    {!payment.isDefault && (
                      <button 
                        onClick={() => handleSetDefault(payment.id!)}
                        className={styles.defaultButton}
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Payment; 