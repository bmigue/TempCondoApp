package com.cenfotec.repository;

import com.cenfotec.domain.PaymentLog;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PaymentLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentLogRepository extends JpaRepository<PaymentLog, Long> {}
