package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CondoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Condo.class);
        Condo condo1 = new Condo();
        condo1.setId(1L);
        Condo condo2 = new Condo();
        condo2.setId(condo1.getId());
        assertThat(condo1).isEqualTo(condo2);
        condo2.setId(2L);
        assertThat(condo1).isNotEqualTo(condo2);
        condo1.setId(null);
        assertThat(condo1).isNotEqualTo(condo2);
    }
}
