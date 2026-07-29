package br.com.mildevs.sistema_escolar_api.repository;

import br.com.mildevs.sistema_escolar_api.entity.Sala;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SalaRepository extends JpaRepository<Sala,Integer> {

    Optional<Sala> findByTurma_CodTurma(Integer codTurma);
}
