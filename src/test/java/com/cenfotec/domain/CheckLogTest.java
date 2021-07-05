package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CheckLogTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CheckLog.class);
        CheckLog checkLog1 = new CheckLog();
        checkLog1.setId(1L);
        CheckLog checkLog2 = new CheckLog();
        checkLog2.setId(checkLog1.getId());
        assertThat(checkLog1).isEqualTo(checkLog2);
        checkLog2.setId(2L);
        assertThat(checkLog1).isNotEqualTo(checkLog2);
        checkLog1.setId(null);
        assertThat(checkLog1).isNotEqualTo(checkLog2);
    }
}
