package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SysLogTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SysLog.class);
        SysLog sysLog1 = new SysLog();
        sysLog1.setId(1L);
        SysLog sysLog2 = new SysLog();
        sysLog2.setId(sysLog1.getId());
        assertThat(sysLog1).isEqualTo(sysLog2);
        sysLog2.setId(2L);
        assertThat(sysLog1).isNotEqualTo(sysLog2);
        sysLog1.setId(null);
        assertThat(sysLog1).isNotEqualTo(sysLog2);
    }
}
