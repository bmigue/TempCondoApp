package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PaymentLogTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentLog.class);
        PaymentLog paymentLog1 = new PaymentLog();
        paymentLog1.setId(1L);
        PaymentLog paymentLog2 = new PaymentLog();
        paymentLog2.setId(paymentLog1.getId());
        assertThat(paymentLog1).isEqualTo(paymentLog2);
        paymentLog2.setId(2L);
        assertThat(paymentLog1).isNotEqualTo(paymentLog2);
        paymentLog1.setId(null);
        assertThat(paymentLog1).isNotEqualTo(paymentLog2);
    }
}
