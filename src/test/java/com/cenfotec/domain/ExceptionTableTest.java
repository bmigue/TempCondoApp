package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExceptionTableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExceptionTable.class);
        ExceptionTable exceptionTable1 = new ExceptionTable();
        exceptionTable1.setId(1L);
        ExceptionTable exceptionTable2 = new ExceptionTable();
        exceptionTable2.setId(exceptionTable1.getId());
        assertThat(exceptionTable1).isEqualTo(exceptionTable2);
        exceptionTable2.setId(2L);
        assertThat(exceptionTable1).isNotEqualTo(exceptionTable2);
        exceptionTable1.setId(null);
        assertThat(exceptionTable1).isNotEqualTo(exceptionTable2);
    }
}
